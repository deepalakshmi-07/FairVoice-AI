const express = require("express");
const router = express.Router();
const OfficialUser = require("../models/officialUser");
const bcrypt = require("bcryptjs"); // Import bcrypt for password comparison
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation

// Route to handle official user login
router.post("/login", async (req, res) => {
  const { username, password, level } = req.body;

  // Ensure all required fields are present
  if (!username || !password || !level) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the official user exists based on username and level
    const officialUser = await OfficialUser.findOne({ username, level });
    if (!officialUser) {
      return res.status(400).json({ error: "Invalid username or level" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, officialUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate a JWT token if the credentials are correct
    const token = jwt.sign(
      {
        officialId: officialUser._id,
        username: officialUser.username,
        level: officialUser.level,
      },
      "your_secret_key", // Use a secret key for JWT signing
      { expiresIn: "1h" } // Token will expire in 1 hour
    );

    // Respond with the token
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
