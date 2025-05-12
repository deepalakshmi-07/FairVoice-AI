const Official = require("../models/officialModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check email exists
  const user = await Official.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // 2. Compare password
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  // 3. Issue JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      department: user.department,
      region: user.region,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, role: user.role });
};
