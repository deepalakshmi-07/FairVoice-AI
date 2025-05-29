// routes/adminRoutes.js

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const permit = require("../middleware/authorizeRoles");
const {
  addOfficial,
  listOfficials,
} = require("../controllers/adminController");

// POST /api/admin/add-official
// Only admins can add a new official
router.post("/api/admin/add-official", auth, permit("admin"), addOfficial);

// GET /api/admin/list-officials
// Only admins can fetch the full list of officials
router.get("/api/admin/list-officials", auth, permit("admin"), listOfficials);

module.exports = router;
