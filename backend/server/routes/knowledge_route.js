import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Knowledge from "../models/knowledge.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

router.get("/", (req, res) => {
  const { grade, subject, chapter } = req.query;
  const query = {};

  if (grade) query.grade = grade;
  if (subject) query.subject = subject;
  if (chapter) query.chapter = chapter;

  Knowledge.find(query)
    .sort({ createdAt: -1 })
    .then(items => res.json({ items }))
    .catch(err => {
      console.error("Knowledge query failed:", err);
      res.status(500).json({ error: "Query failed" });
    });
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { grade, subject, chapter = "", title = "", text = "" } = req.body;

    if (!grade || !subject) {
      return res.status(400).json({ error: "grade and subject are required" });
    }

    let fileName = "";
    let fileText = "";

    if (req.file) {
      fileName = req.file.originalname;
      if (req.file.mimetype === "application/pdf") {
        const parsed = await pdfParse(req.file.buffer);
        fileText = parsed?.text || "";
      } else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
        fileText = parsed?.value || "";
      } else {
        return res.status(400).json({ error: "Only PDF or DOCX files are supported" });
      }
    }

    if (!text.trim() && !fileText.trim()) {
      return res.status(400).json({ error: "Provide text or a PDF file" });
    }

    const sourceType =
      text.trim() && fileText.trim()
        ? "mixed"
        : fileText.trim()
          ? "pdf"
          : "text";

    const item = await Knowledge.create({
      grade,
      subject,
      chapter: chapter.trim(),
      title: title.trim(),
      text: text.trim(),
      fileName,
      fileText,
      sourceType,
      createdAt: new Date()
    });

    res.json({ item });
  } catch (err) {
    console.error("Knowledge upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, subject, chapter = "", title = "", text = "" } = req.body;

    if (!grade || !subject) {
      return res.status(400).json({ error: "grade and subject are required" });
    }

    let fileName = "";
    let fileText = "";

    if (req.file) {
      fileName = req.file.originalname;
      if (req.file.mimetype === "application/pdf") {
        const parsed = await pdfParse(req.file.buffer);
        fileText = parsed?.text || "";
      } else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
        fileText = parsed?.value || "";
      } else {
        return res.status(400).json({ error: "Only PDF or DOCX files are supported" });
      }
    }

    const sourceType =
      text.trim() && fileText.trim()
        ? "mixed"
        : fileText.trim()
          ? "pdf"
          : "text";

    const update = {
      grade,
      subject,
      chapter: chapter.trim(),
      title: title.trim(),
      text: text.trim()
    };

    if (req.file) {
      update.fileName = fileName;
      update.fileText = fileText;
      update.sourceType = sourceType;
    }

    const item = await Knowledge.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ error: "Not found" });

    res.json({ item });
  } catch (err) {
    console.error("Knowledge update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Knowledge.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Knowledge delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
