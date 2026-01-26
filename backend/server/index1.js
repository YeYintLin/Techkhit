import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import { searchBook } from "./utils/searchBook.js";

const app = express();
app.use(cors());
app.use(express.json());

// ================= CONFIG =================
const SHOW_ENGLISH_LOGS = true;
const MAX_MEMORY = 10;

// ================= MEMORY =================
let conversation = [];

// ================= LOAD BOOK =================
const bookData = JSON.parse(
  fs.readFileSync("./data/book.json", "utf-8")
);

// ================= BUILD BOOK CONTEXT =================
function buildBookContext() {
  let context = `Book Title: ${bookData.book.title_en} (${bookData.book.title_my})\n`;
  context += `Grade: ${bookData.book.grade}\n\n`;

  // Intro pages
  bookData.intro.forEach(page => {
    context += `Page ${page.page}: ${page.title_en} (${page.title_my})\n`;
    context += `${page.description_en}\n\n`;
  });

  // Table of contents
  bookData.table_of_contents.forEach(part => {
    context += `Part ${part.part_id}: ${part.part_title_en} (${part.part_title_my})\n`;

    part.sections.forEach(section => {
      context += `  Lesson ${section.lesson_id}: ${section.title_en} (${section.title_my})`;
      if (section.page) context += ` - Page: ${section.page}`;
      context += "\n";

      if (section.subsections) {
        section.subsections.forEach(sub => {
          context += `    - ${sub.title_en} (${sub.title_my}) - Page: ${sub.page}\n`;
        });
      }
    });

    context += "\n";
  });

  return context;
}

// ================= TRANSLATE (FLASK) =================
async function translateTextLocal(text, direction) {
  try {
    const response = await axios.post("http://localhost:8000/translate", {
      text,
      direction // "my->en" or "en->my"
    });
    return response.data.translation;
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return text;
  }
}

// ================= CHAT ENDPOINT =================
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    console.log("\n================ USER =================");
    console.log("MY :", message);

    // Translate user input to English
    const userMessageEn = await translateTextLocal(message, "my->en");
    if (SHOW_ENGLISH_LOGS) console.log("EN :", userMessageEn);
    console.log("======================================");

    // ===== SEARCH JSON =====
    const bookHit = searchBook(message, bookData);

    if (bookHit && bookHit.length > 0) {
      console.log("📘 JSON match found!");
      return res.json({ reply: bookHit });
    }

    console.log("📘 No direct JSON match, fallback to AI");

    // ===== SYSTEM PROMPT =====
    const systemPrompt = `
You are a kind and knowledgeable teacher.
Answer questions clearly and concisely using ONLY the following book content:

${buildBookContext()}

If a question is not found in the content, reply:
"I could not find relevant information in the book."
Keep sentences short and easy to understand.
`;

    // ===== BUILD PROMPT WITH MEMORY =====
    let prompt = systemPrompt + "\n";
    conversation.forEach(msg => {
      prompt += msg.role === "student"
        ? `Student: ${msg.text}\n`
        : `Teacher: ${msg.text}\n`;
    });
    prompt += `Student: ${userMessageEn}\nTeacher:`;

    // ===== AI CALL =====
    const ollama = await axios.post(
      "http://localhost:11434/api/generate",
      { model: "llama3:latest", prompt, stream: false }
    );

    const aiReplyEn = ollama.data.response;

    console.log("\n================ AI ===================");
    if (SHOW_ENGLISH_LOGS) console.log("EN :", aiReplyEn);

    // Translate AI reply back to Myanmar
    const aiReplyMy = await translateTextLocal(aiReplyEn, "en->my");
    console.log("MY :", aiReplyMy);
    console.log("======================================");

    // ===== SAVE MEMORY =====
    conversation.push({ role: "student", text: userMessageEn });
    conversation.push({ role: "teacher", text: aiReplyEn });
    if (conversation.length > MAX_MEMORY) conversation = conversation.slice(-MAX_MEMORY);

    // ===== RESPONSE =====
    res.json({
      reply: aiReplyMy,
      reply_en: aiReplyEn
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Failed" });
  }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
