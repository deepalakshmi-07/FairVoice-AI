// backend-api/scripts/seedAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Official = require("../models/officialModel");

// Load .env values
const MONGO_URI = process.env.MONGO_URI;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = "admin@fairvoice.com";
    const existingAdmin = await Official.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const newAdmin = new Official({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        phone: "9600953988",
        department: "admin",
        role: "admin",
        region: "HQ",
      });

      await newAdmin.save();
      console.log("✅ Admin account created successfully.");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    mongoose.connection.close();
  }
}

seedAdmin();
