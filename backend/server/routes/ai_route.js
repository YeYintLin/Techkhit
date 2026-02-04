import express from "express";
import { handleAI } from "../services/ai_service.js"; // your dynamic AI handler

const router = express.Router();

// GET /api/chat/test
router.get("/test", (req, res) => {
  res.json({ message: "AI route is working!" });
});
// POST /api/chat
router.post("/", async (req, res) => {
  const { grade, subject, message } = req.body;

  if (!grade || !subject || !message) {
    return res.status(400).json({
      reply: { text: "Please select grade, subject, and enter a question.", youtubeUrl: null },
      reply_en: { text: "Please select grade, subject, and enter a question.", youtubeUrl: null }
    });
  }

  try {
    const response = await handleAI({ grade, subject, message });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: { text: "Server error", youtubeUrl: null },
      reply_en: { text: "Server error", youtubeUrl: null }
    });
  }
});

export default router;
