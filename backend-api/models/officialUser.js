//Official register
const mongoose = require("mongoose");

const officialUserSchema = new mongoose.Schema({
  department: { type: String, required: true },
  district: { type: String, required: true },
  level: { type: String, required: true },
  username: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Exactly 10 digits
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  password: {
    type: String,
    required: true,
    // No validation regex needed for password here since we are hashing it
  },
});

module.exports = mongoose.model("officialUser", officialUserSchema);
