const express = require("express");
const router = express.Router();
const Petition = require("../models/petitionModel");
const multer = require("multer");
const path = require("path");
const exifr = require("exifr"); // For EXIF GPS extraction
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios"); // for AI calls

// 1. Configure Multer Storage
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "uploads/photoGeoloc/");
    } else if (file.fieldname === "attachments") {
      cb(null, "uploads/attachments/");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// 2. Configure Multer Middleware
const upload = multer({ storage: photoStorage });
const uploadFiles = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "attachments", maxCount: 10 },
]);

// 3. POST /api/petitions/submit
router.post("/submit", authMiddleware, uploadFiles, async (req, res) => {
  console.log("✅ /submit route hit by user:", req.user.id);

  try {
    const userId = req.user.id;
    const {
      name,
      phoneNumber,
      district,
      taluk,
      subDistrict,
      petitionLocation,
      petitionTitle,
      petitionDescription,
    } = req.body;

    // 4. Get Uploaded File Paths
    const photoPath = req.files.photo
      ? `/uploads/photoGeoloc/${req.files.photo[0].filename}`
      : "";
    const attachmentsPaths = req.files.attachments
      ? req.files.attachments.map((f) => `/uploads/attachments/${f.filename}`)
      : [];

    // 5. Extract Geolocation
    let geolocation;
    if (req.files.photo) {
      try {
        const gpsData = await exifr.gps(req.files.photo[0].path);
        if (gpsData?.latitude && gpsData?.longitude) {
          geolocation = {
            latitude: gpsData.latitude,
            longitude: gpsData.longitude,
          };
        }
      } catch (err) {
        console.warn("EXIF geolocation failed:", err.message);
      }
    }

    // 6. Call AI Models
    // Categorization
    let category = "Uncategorized";
    try {
      const { data } = await axios.post(
        "http://localhost:8000/predict-department",
        { text: petitionTitle }
      );
      category = data.department;
    } catch (err) {
      console.error("Error calling categorization model:", err.message);
    }

    // Urgency
    let urgency = "Not Urgent";
    try {
      const { data } = await axios.post(
        "http://localhost:8000/predict-urgency",
        { text: petitionTitle }
      );
      urgency = data.urgency;
    } catch (err) {
      console.error("Error calling urgency model:", err.message);
    }

    // Repetition Detection
    // 6a. Define 30-day window
    const DAYS_WINDOW = 30;
    const sinceDate = new Date(Date.now() - DAYS_WINDOW * 24 * 60 * 60 * 1000);

    // 6b. Fetch only same-dept, same-subDistrict, recent petitions
    const candidates = await Petition.find(
      {
        category: category,
        subDistrict: subDistrict,
        createdAt: { $gte: sinceDate },
      },
      "petitionTitle"
    ).lean();
    const existingTitles = candidates.map((d) => d.petitionTitle);

    let isRepetitive = false;
    let duplicateWith = [];
    // GUARD: only call repetition API if we have something to compare
    if (existingTitles.length > 0) {
      try {
        const { data } = await axios.post(
          "http://localhost:8000/predict-repetition",
          {
            text: petitionTitle,
            existing: existingTitles,
          }
        );
        isRepetitive = data.is_repetitive;

        if (isRepetitive) {
          // Map indices → titles
          const matchedTitles = data.duplicate_indices.map(
            (i) => existingTitles[i]
          );
          // Fetch all matching documents by title within the same filter
          const duplicates = await Petition.find(
            {
              category: category,
              subDistrict: subDistrict,
              petitionTitle: { $in: matchedTitles },
              createdAt: { $gte: sinceDate },
            },
            "_id"
          ).lean();
          duplicateWith = duplicates.map((d) => d._id);
        }
      } catch (err) {
        console.error("Error calling repetition model:", err.message);
      }
    } else {
      console.log("▶️ No candidates for repetition check—skipping.");
    }

    // 7. Create & Save Petition
    const newPetition = new Petition({
      userId,
      name,
      phoneNumber,
      district,
      taluk,
      subDistrict,
      petitionLocation,
      petitionTitle,
      petitionDescription,
      photo: photoPath,
      attachments: attachmentsPaths,
      ...(geolocation && { geolocation }),
      category, // AI field
      urgency, // AI field
      isRepetitive, // repetition flag
      duplicateWith, // array of ObjectId
    });

    const saved = await newPetition.save();

    // 8. Respond with Success
    return res.status(201).json({
      message: "Petition submitted successfully",
      petition: saved,
    });
  } catch (error) {
    console.error("Error saving petition:", error);
    return res.status(500).json({ error: "Failed to store petition" });
  }
});

// GET /api/petitions/mine (unchanged)
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const petitions = await Petition.find({ userId })
      .sort({ createdAt: -1 })
      .select("petitionTitle status grievanceId createdAt");
    res.status(200).json(petitions);
  } catch (err) {
    console.error("Fetch my petitions error:", err);
    res.status(500).json({ message: "Failed to fetch your petitions." });
  }
});

// routes/petitionRoutes.js
// … your existing requires/imports …

// Mapping from JWT “department” → Petition.category in DB
const DEPT_MAP = {
  law: "Law and Order",
  infra: "Infrastructure",
  health: "Health",
  education: "Education",
  welfare: "Social Welfare",
  admin: "Administration",
};

// Mapping from JWT “region” → Petition.district in DB
const DISTRICT_MAP = {
  chennai: "Chennai",
  kanchipuram: "Kanchipuram",
};

// Mapping from JWT “region” → Petition.subDistrict in DB
const SUBDISTRICT_MAP = {
  northchennai: "Chennai North Division",
  southchennai: "Chennai South Division",
  centralchennai: "Chennai Central Division",
  kanchipuram: "Kanchipuram Revenue Division",
  sriperumbudur: "Sriperumbudur Revenue Division",
};

// GET /api/petitions/forOfficial
router.get("/forOfficial", authMiddleware, async (req, res) => {
  try {
    const { role, region, department } = req.user;

    // 1) Map the lowercase token values to your DB values
    const categoryValue = DEPT_MAP[department] || department;
    const districtValue = DISTRICT_MAP[region] || region;
    const subDistrictValue = SUBDISTRICT_MAP[region] || region;

    // 2) Base filter: department → petition.category
    let filter = { category: categoryValue };

    // 3) Narrow by region for district & subdistrict roles
    if (role === "district") {
      filter.district = districtValue;
    } else if (role === "subdistrict") {
      filter.subDistrict = subDistrictValue;
    }
    // state officers see everything in their department

    // 4) Fetch & return
    const petitions = await Petition.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json(petitions);
  } catch (err) {
    console.error("Error in /forOfficial:", err);
    return res.status(500).json({ message: "Could not load petitions." });
  }
});

module.exports = router;
