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
    // 6a. Fetch only titles and _id from DB
    const existingDocs = await Petition.find({}, "petitionTitle").lean();
    const existingTitles = existingDocs.map((d) => d.petitionTitle);

    let isRepetitive = false;
    let duplicateWith = [];
    try {
      const { data } = await axios.post(
        "http://localhost:8000/predict-repetition",
        {
          text: petitionTitle,
          existing: existingTitles,
        }
      );
      isRepetitive = data.is_repetitive;
      duplicateWith = data.duplicate_indices.map((i) => existingDocs[i]._id);
    } catch (err) {
      console.error("Error calling repetition model:", err.message);
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

module.exports = router;
