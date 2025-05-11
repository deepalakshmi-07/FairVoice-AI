const mongoose = require("mongoose");

const OfficialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },

  password: {
    type: String,
    required: true,
    minlength: 60, // bcrypt-hashed password
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Please use a valid 10-digit phone number"],
  },

  department: {
    type: String,
    required: true,
    enum: {
      values: ["health", "law", "infra", "education", "welfare", "admin"],
      message: "{VALUE} is not a valid department",
    },
  },

  role: {
    type: String,
    required: true,
    enum: {
      values: ["subdistrict", "district", "state", "admin"],
      message: "{VALUE} is not a valid role",
    },
  },

  region: {
    type: String,
    required: true,
    trim: true,
    // e.g. 'South Chennai', 'Kanchipuram', 'Tamil Nadu', or 'HQ' for admin
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Official", OfficialSchema);
