require("dotenv").config();
const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const router = express.Router();

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Temporary storage for OTP – in production, use Redis or a DB with expiry.
let otpStore = {};

// Function to standardize phone number format
function formatPhoneNumber(number) {
  if (!number.startsWith("+91")) {
    return "+91" + number;
  }
  return number;
}

// --------------------
// 1. User Registration
// --------------------
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      gender,
      aadhaarNumber,
      address,
      district,
      pincode,
    } = req.body;

    // Format phone number to standard format
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Check if user exists
    const existingUser = await User.findOne({
      phoneNumber: formattedPhoneNumber,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists! Please log in." });
    }

    // Validate Aadhaar number (must be exactly 12 digits)
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaarNumber)) {
      return res.status(400).json({
        message: "Invalid Aadhaar number. It must be exactly 12 digits.",
      });
    }

    // Hash Aadhaar for security
    const hashedAadhaar = await bcrypt.hash(aadhaarNumber, 10);

    const newUser = new User({
      name,
      phoneNumber: formattedPhoneNumber, // Store in standardized format
      email,
      gender,
      aadhaarNumber: hashedAadhaar,
      address,
      district,
      pincode,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// --------------------
// 2. Login: Send OTP
// --------------------
router.post("/login", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Format phone number before querying
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Verify that user exists
    const user = await User.findOne({ phoneNumber: formattedPhoneNumber });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found! Please register first." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[formattedPhoneNumber] = otp; // Save OTP temporarily

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: twilioPhoneNumber,
      to: formattedPhoneNumber, // Send OTP to formatted number
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// -----------------------------
// 3. Verify OTP & Login
// -----------------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Format phone number before querying
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Check if OTP is valid
    if (
      !otpStore[formattedPhoneNumber] ||
      otpStore[formattedPhoneNumber] != otp
    ) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    // OTP verified; generate a JWT token
    const user = await User.findOne({ phoneNumber: formattedPhoneNumber });
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove OTP once verified
    delete otpStore[formattedPhoneNumber];

    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
});

module.exports = router;
