const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roadmapId: { type: String, required: true },
  completedTopics: [{
    topicId: String,
    topicName: String,
    completedAt: { type: Date, default: Date.now }
  }],
  totalTopics: { type: Number, default: 0 },
  lastStudied: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);