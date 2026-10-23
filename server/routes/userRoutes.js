const express = require("express");
const router = express.Router();
const { updateOnboarding, getProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.put("/onboarding", protect, updateOnboarding);
router.get("/profile", protect, getProfile);

module.exports = router;