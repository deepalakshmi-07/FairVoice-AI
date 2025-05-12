const router = require("express").Router();
const { login } = require("../controllers/officialAuthController");

// POST /api/auth/official-login  <-- this runs email/password login for officials
router.post("/api/auth/official-login", login);

module.exports = router;
