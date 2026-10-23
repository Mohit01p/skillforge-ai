const express = require("express");
const router = express.Router();
const { uploadDocument, chatWithDocument, ragUpload, ragQuery, getHistory, getDocument, deleteDocument } = require("../controllers/documentController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", protect, upload.single("pdf"), uploadDocument);
router.post("/chat", protect, chatWithDocument);
router.post("/rag-upload", protect, upload.single("pdf"), ragUpload);
router.post("/rag-query", protect, ragQuery);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getDocument);
router.delete("/:id", protect, deleteDocument);

module.exports = router;