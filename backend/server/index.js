import express from "express";
import cors from "cors";
import axios from "axios";
import googleTranslate from "@vitalets/google-translate-api";
import fs from "fs";

const { translate } = googleTranslate;
const app = express();
app.use(cors());
app.use(express.json());

// Keep conversation memory for multi-turn chat
let conversation = [];

// Load PDF content from JSON
const pdfData = JSON.parse(fs.readFileSync("op.json", "utf-8"));

// Function to build PDF context as string
function buildPDFContext() {
  let context = "";
  pdfData.pages.forEach(page => {
    context += `Page ${page.page}:\n`;
    page.lines.forEach(line => {
      context += line + "\n";
    });
    context += "\n";
  });
  return context;
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    console.log("User input:", message);

    // 1️⃣ Translate user message to English
    const toEn = await translate(message, { from: "my", to: "en" });
    console.log("Translated to EN:", toEn.text);

    // 2️⃣ Build system prompt with PDF content
    const systemPrompt = `
You are a kind and knowledgeable teacher.
Answer questions clearly and concisely using the following content:

${buildPDFContext()}

Keep sentences short and easy to understand.
Avoid long explanations unless necessary.
`;

    // 3️⃣ Build full prompt including conversation memory
    let prompt = systemPrompt + "\n";
    conversation.forEach(msg => {
      if (msg.role === "student") prompt += `Student: ${msg.text}\n`;
      else prompt += `Teacher: ${msg.text}\n`;
    });
    prompt += `Student: ${toEn.text}\nTeacher:`;

    // 4️⃣ Get AI response from Ollama
    const ollama = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3:latest",
      prompt,
      stream: false
    });
    console.log("Ollama EN reply:", ollama.data.response);

    // Save conversation
    conversation.push({ role: "student", text: toEn.text });
    conversation.push({ role: "teacher", text: ollama.data.response });

    // 5️⃣ Translate AI response back to Myanmar
    const toMy = await translate(ollama.data.response, { from: "en", to: "my" });
    console.log("Translated to MY:", toMy.text);

    // 6️⃣ Send reply to frontend
    res.json({ reply: toMy.text });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
