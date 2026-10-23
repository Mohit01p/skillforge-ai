const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  careerGoal: { type: String, enum: ["mern","java-backend","python","devops","dsa-focus"] },
  currentSkills: [{ type: String }],
  isOnboarded: { type: Boolean, default: false },
  theme: { type: String, enum: ["light","dark"], default: "dark" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);