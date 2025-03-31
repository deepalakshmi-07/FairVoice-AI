const mongoose = require("mongoose");

const petitionerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/,
  }, // Ensures valid Indian phone numbers
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  }, // Basic email validation
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{12}$/,
  }, // Aadhaar must be 12 digits
  address: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: String, required: true, match: /^\d{6}$/ }, // Indian pincode validation
  createdAt: { type: Date, default: Date.now }, // Stores registration timestamp
});

const Petitioner = mongoose.model("Petitioner", petitionerSchema);
module.exports = Petitioner;
