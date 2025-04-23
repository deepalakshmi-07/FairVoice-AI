const multer = require("multer");
const path = require("path");

// Storage for photo
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/photoGeoloc");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_photo_" + file.originalname);
  },
});

// Storage for attachments
const attachmentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/attachments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_attach_" + file.originalname);
  },
});

// File filter (optional)
function fileFilter(req, file, cb) {
  cb(null, true); // allow all files
}

// Create uploaders
const photoUpload = multer({ storage: photoStorage, fileFilter }).single(
  "photo"
);
const attachmentsUpload = multer({
  storage: attachmentStorage,
  fileFilter,
}).array("attachments", 5); // max 5 files

// Combined middleware
function uploadFiles(req, res, next) {
  photoUpload(req, res, function (err) {
    if (err) return res.status(400).json({ error: "Photo upload failed" });

    attachmentsUpload(req, res, function (err) {
      if (err)
        return res.status(400).json({ error: "Attachment upload failed" });

      next();
    });
  });
}

module.exports = uploadFiles;
