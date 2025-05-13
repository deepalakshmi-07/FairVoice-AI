require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const authRoutes = require("./routes/authRoutes");
const petitionRoutes = require("./routes/petitionRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);
app.use("/api/user", userRoutes);

// Official email/password login
app.use(require("./routes/officialAuthRoutes"));

// Admin-only routes
app.use(require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Hello World from backend API Server.");
});

// app.post("/api/users", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Connection Failed!", error);
  });
