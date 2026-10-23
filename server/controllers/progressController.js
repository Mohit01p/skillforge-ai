const Progress = require("../models/Progress");

exports.getProgress = async (req, res) => {
  const progress = await Progress.findOne({ user: req.user.id, roadmapId: req.params.roadmapId });
  res.json(progress || { completedTopics: [] });
};

exports.getAllProgress = async (req, res) => {
  const progress = await Progress.find({ user: req.user.id });
  res.json(progress);
};

exports.markComplete = async (req, res) => {
  const { roadmapId, topicId, topicName } = req.body;
  let progress = await Progress.findOne({ user: req.user.id, roadmapId });

  if (!progress) {
    progress = await Progress.create({ user: req.user.id, roadmapId, completedTopics: [] });
  }
  if (!progress.completedTopics.some(t => t.topicId === topicId)) {
    progress.completedTopics.push({ topicId, topicName });
    await progress.save();
  }
  res.json(progress);
};

exports.uncomplete = async (req, res) => {
  const { roadmapId, topicId } = req.body;
  const progress = await Progress.findOne({ user: req.user.id, roadmapId });
  progress.completedTopics = progress.completedTopics.filter(t => t.topicId !== topicId);
  await progress.save();
  res.json(progress);
};