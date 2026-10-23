const mongoose = require("mongoose");

const documentChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: { type: String, required: true },
  fileUri: { type: String },
  ragDocId: { type: String },
  chatHistory: [{
    role: { type: String, enum: ["user", "assistant"] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  mode: { type: String, enum: ["gemini", "rag"], default: "gemini" }
}, { timestamps: true });

module.exports = mongoose.model("DocumentChat", documentChatSchema);