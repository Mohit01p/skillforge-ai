const InterviewAttempt = require("../models/InterviewAttempt");
const callGemini = require("../utils/geminiHelper");

exports.saveAttempt = async (req, res) => {
  try {
    const { topic, question, userAnswer } = req.body;
    const prompt = `You are a senior technical interviewer.
Question: ${question}
Candidate Answer: ${userAnswer}
Return ONLY JSON:
{ "score": 7, "whatWasGood": "...", "whatWasMissing": "...",
  "idealAnswer": "...", "tip": "..." }
No extra text, only JSON.`;
    const feedback = await callGemini(prompt);

    const attempt = await InterviewAttempt.create({
      user: req.user.id, topic, question, userAnswer,
      aiFeedback: JSON.stringify(feedback), score: feedback.score,
    });

    res.json({ attempt, feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttempts = async (req, res) => {
  const attempts = await InterviewAttempt.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(attempts);
};