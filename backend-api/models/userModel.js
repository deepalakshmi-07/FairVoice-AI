const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+91[6-9]\d{9}$/, "Invalid phone number format."], // Only store +91XXXXXXXXXX format
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address."],
  },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    // Removed match validation since we are storing hashed Aadhaar.
    // You can validate it before hashing in your controller.
  },
  address: { type: String, required: true },
  district: { type: String, required: true },
  pincode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, "Invalid pincode."],
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
