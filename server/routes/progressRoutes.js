const express = require("express");
const router = express.Router();
const { getProgress, getAllProgress, markComplete, uncomplete } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");

router.get("/all", protect, getAllProgress);
router.get("/:roadmapId", protect, getProgress);
router.post("/complete", protect, markComplete);
router.delete("/uncomplete", protect, uncomplete);

module.exports = router;