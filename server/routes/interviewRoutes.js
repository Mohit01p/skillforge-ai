const express = require("express");
const router = express.Router();
const { saveAttempt, getAttempts } = require("../controllers/interviewController");
const protect = require("../middleware/authMiddleware");

router.post("/attempt", protect, saveAttempt);
router.get("/attempts", protect, getAttempts);

module.exports = router;