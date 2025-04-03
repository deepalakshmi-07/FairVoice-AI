const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Name of the petitioner
  phoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/,
  }, // Petitioner's phone number (not unique, in case of multiple petitions)
  petitionLocation: { type: String, required: true }, // Location where the issue is raised
  petitionTitle: { type: String, required: true, trim: true }, // Short title summarizing the petition
  petitionDescription: { type: String, required: true }, // Detailed explanation of the grievance
  attachments: [{ type: String }], // URLs of documents (if uploaded)
  photo: { type: String, required: false }, // URL of the uploaded photo
  geolocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  }, // Stores the petitioner's exact location
  status: {
    type: String,
    enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
    default: "Submitted",
  }, // Tracks petition progress
  createdAt: { type: Date, default: Date.now }, // Petition submission timestamp
});

const Petition = mongoose.model("Petition", petitionSchema);
module.exports = Petition;
