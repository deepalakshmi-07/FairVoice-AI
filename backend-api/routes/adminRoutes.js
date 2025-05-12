const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const permit = require("../middleware/authorizeRoles");
const { addOfficial } = require("../controllers/adminController");

// Only admins get through
router.post("/api/admin/add-official", auth, permit("admin"), addOfficial);

module.exports = router;
