// userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authenticateToken = require("../middleware/authMiddleware.js");

// for update profile
// GET /api/user/profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("GET /api/user/profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// PUT /api/user/profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phoneNumber,
      email,
      address,
      district,
      pincode,
      aadhaarNumber,
      gender,
    } = req.body;

    // Required fields check
    if (!name || !phoneNumber || !email) {
      return res
        .status(400)
        .json({ message: "Name, phone and email are required" });
    }

    // Update document, enforce schema validators with runValidators
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phoneNumber,
        email,
        address,
        district,
        pincode,
        aadhaarNumber,
        gender,
      },
      {
        new: true,
        runValidators: true, // makes sure your schema's match/enum rules still apply
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("PUT /api/user/profile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
