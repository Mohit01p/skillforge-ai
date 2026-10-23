const mongoose = require("mongoose");

const interviewAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  aiFeedback: { type: String },
  score: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("InterviewAttempt", interviewAttemptSchema);