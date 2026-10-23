const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const DocumentChat = require("../models/DocumentChat");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const RAG_URL = process.env.RAG_SERVICE_URL;

exports.uploadDocument = async (req, res) => {
  try {
    const filePath = req.file.path;
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: req.file.originalname,
    });

    const doc = await DocumentChat.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUri: uploadResult.file.uri,
      chatHistory: [],
    });

    fs.unlinkSync(filePath);

    res.json({ documentId: doc._id, fileName: doc.fileName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.chatWithDocument = async (req, res) => {
  try {
    const { documentId, message } = req.body;
    const doc = await DocumentChat.findById(documentId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const models = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
    let responseText = null;
    let lastErr;

    for (const name of models) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent([
          { fileData: { fileUri: doc.fileUri, mimeType: "application/pdf" } },
          { text: message },
        ]);
        responseText = result.response.text();
        break;
      } catch (err) {
        lastErr = err;
        if (err.status === 403 || err.status === 404) {
          return res.status(410).json({
            message: "This file expired on Gemini (files last 48 hours). Click 'Index for RAG' to keep it permanently, or upload the PDF again.",
          });
        }
        console.error(`[Gemini] ${name} failed: ${err.message}`);
      }
    }

    if (!responseText) throw lastErr;

    doc.chatHistory.push({ role: "user", content: message });
    doc.chatHistory.push({ role: "assistant", content: responseText });
    await doc.save();

    res.json({ reply: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI is busy. Please try again." });
  }
};

exports.ragUpload = async (req, res) => {
  try {
    const filePath = req.file.path;
    const docId = req.body.documentId;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), req.file.originalname);
    formData.append("docId", docId);

    const ragRes = await axios.post(`${RAG_URL}/rag/upload`, formData, {
      headers: formData.getHeaders(),
    });

    await DocumentChat.findByIdAndUpdate(docId, { ragDocId: docId, mode: "rag" });

    fs.unlinkSync(filePath);

    res.json(ragRes.data);
  } catch (err) {
  console.error(err.response?.data || err.message);
  res.status(500).json({ message: err.response?.data?.detail || err.message });
}
};

exports.ragQuery = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    const formData = new FormData();
    formData.append("docId", documentId);
    formData.append("question", question);

    const ragRes = await axios.post(`${RAG_URL}/rag/query`, formData, {
      headers: formData.getHeaders(),
    });

    const doc = await DocumentChat.findById(documentId);
    doc.chatHistory.push({ role: "user", content: question });
    doc.chatHistory.push({ role: "assistant", content: ragRes.data.answer });
    await doc.save();

    res.json(ragRes.data);
  } catch (err) {
  console.error(err.response?.data || err.message);
  res.status(500).json({ message: err.response?.data?.detail || err.message });
}
};

exports.getHistory = async (req, res) => {
  const docs = await DocumentChat.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(docs);
};

exports.getDocument = async (req, res) => {
  const doc = await DocumentChat.findById(req.params.id);
  res.json(doc);
};

exports.deleteDocument = async (req, res) => {
  const doc = await DocumentChat.findById(req.params.id);
  if (doc.ragDocId) {
    try { await axios.delete(`${RAG_URL}/rag/document/${doc.ragDocId}`); } catch (e) {}
  }
  await DocumentChat.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};