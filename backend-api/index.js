const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World from backend API Server Updated good to go.");
});

mongoose
  .connect(
    "mongodb+srv://deepalakshmi2378:TechnovateGurls%4031@backenddb.vkpdiod.mongodb.net/Backend-API?retryWrites=true&w=majority&appName=BackendDB"
  )
  .then(() => {
    console.log("Connected to Database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection Failed!");
  });
