//Official register
const express = require("express");
const router = express.Router();
const OfficialUser = require("../models/officialUser");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

// Route to handle official user registration
router.post("/register", async (req, res) => {
  const { department, district, level, username, phone, password } = req.body;

  // Ensure all required fields are present
  if (!department || !district || !level || !username || !phone || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await OfficialUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new official user with hashed password
    const newUser = new OfficialUser({
      department,
      district,
      level,
      username,
      phone,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "Official registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
