const User = require("../models/User");

exports.updateOnboarding = async (req, res) => {
  try {
    const { careerGoal, currentSkills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { careerGoal, currentSkills, isOnboarded: true },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};