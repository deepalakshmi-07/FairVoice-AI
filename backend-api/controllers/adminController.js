const Official = require("../models/officialModel");
const bcrypt = require("bcrypt");

exports.addOfficial = async (req, res) => {
  const { name, email, password, phone, department, role, region } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const newOff = await Official.create({
      name,
      email,
      password: hash,
      phone,
      department,
      role,
      region,
    });
    res.json({ message: "Official created", id: newOff._id });
  } catch (err) {
    const msg =
      err.code === 11000 ? "Email already exists" : "Error creating official";
    res.status(400).json({ message: msg });
  }
};

// GET /api/admin/list-officials
exports.listOfficials = async (req, res) => {
  try {
    const officers = await Official.find()
      .select("-password") // omit the hashed password
      .sort({ department: 1, role: 1, region: 1, name: 1 });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching officials" });
  }
};
