const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // basic validation for Indian mobile numbers
    },
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    subDistrict: { type: String, required: true },
    petitionLocation: { type: String, required: true },
    petitionTitle: { type: String, required: true },
    petitionDescription: {
      type: String,
      required: true,
      maxlength: 1000, // Roughly 100 words max
    },
    photo: { type: String }, // store file path or URL
    geolocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    attachments: [{ type: String }], // array of file paths or URLs
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
      default: "Submitted",
    },
    grievanceId: {
      type: String,
      unique: true,
      sparse: true, // allows some petitions to have null grievanceId
    },
    // ← NEW AI fields
    category: { type: String, default: "Uncategorized" },
    urgency: { type: String, default: "Not Urgent" },

    // ← NEW REPETITION fields
    isRepetitive: { type: Boolean, default: false },
    duplicateWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "Petition" }],

    // ← DEADLINE field (30 days after submission)
    deadline: { type: Date }, // automatically set before saving
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

// ← Mongoose middleware to set deadline 30 days after createdAt
petitionSchema.pre("save", function (next) {
  if (!this.deadline) {
    const createdAt = this.createdAt || new Date();
    const deadlineDate = new Date(createdAt);
    deadlineDate.setDate(deadlineDate.getDate() + 30);
    this.deadline = deadlineDate;
  }
  next();
});

const Petition = mongoose.model("Petition", petitionSchema);
module.exports = Petition;
