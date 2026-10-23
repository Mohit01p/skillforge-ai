const express = require("express");
const router = express.Router();
const { topicExplain, roadmapGenerator, skillGap, dailyPlanner, projectIdeas, mentorChat, generateQuiz, buildResume, atsScore } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/topic-explain", protect, topicExplain);
router.post("/roadmap-generator", protect, roadmapGenerator);
router.post("/skill-gap", protect, skillGap);
router.post("/daily-planner", protect, dailyPlanner);
router.post("/project-ideas", protect, projectIdeas);
router.post("/mentor", protect, mentorChat);
router.post("/generate-quiz", protect, generateQuiz);
router.post("/build-resume", protect, buildResume);
router.post("/ats-score", protect, atsScore);

module.exports = router;