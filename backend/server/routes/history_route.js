import express from "express";
import ChatHistory from "../models/chatHistory.js";

const router = express.Router();

// Save chat history
router.post("/", async (req, res) => {
  const { grade, subject, messages } = req.body;

  if (!grade || !subject || !messages) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const chat = new ChatHistory({ grade, subject, messages });
    await chat.save();
    res.json({ success: true, chatId: chat._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save chat history" });
  }
});

// Get chat history (optional)
router.get("/", async (req, res) => {
  try {
    const chats = await ChatHistory.find().sort({ createdAt: -1 }).limit(50);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

export default router;
