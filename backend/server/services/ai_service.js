import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { searchBook } from "../utils/searchBook.js";
import { generateAIExplanation } from "./ai_generate.js";
import Knowledge from "../models/knowledge.js";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handleAI({ grade, subject, message }) {
  console.log("User input:", message);
  console.log("Grade:", grade, "Subject:", subject);

  // =========================
  // Validation
  // =========================
  if (!grade || !subject) {
    return {
      reply: { text: "Please select a grade and subject first.", videos: [] },
      reply_en: { text: "Please select a grade and subject first.", videos: [] }
    };
  }

  // =========================
  // Load book JSON safely
  // =========================
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataRoot = path.resolve(__dirname, "..", "data");
  const filePath = path.join(dataRoot, grade, `${subject}.json`);

  let bookData;
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
      bookData = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse book JSON:", err);
    }
  }

  // =========================
  // Search book content
  // =========================
  let hit;
  if (bookData) {
    hit = searchBook(message, bookData);
  }

  // =========================
  // Load teacher knowledge (MongoDB)
  // =========================
  let teacherNotes = [];
  try {
    const items = await Knowledge.find({ grade, subject }).sort({ createdAt: -1 }).lean();
    const msg = (message || "").toLowerCase();
    const matchValue = v => (v || "").toString().trim().toLowerCase();

    let chapterCandidates = [];
    if (hit) {
      chapterCandidates = [
        hit.lesson_id?.toString(),
        hit.title_en,
        hit.title_my
      ].map(matchValue).filter(Boolean);
    }

    teacherNotes = items.filter(item => {
      const chapter = matchValue(item.chapter);
      if (!chapter) return true;
      if (chapterCandidates.includes(chapter)) return true;
      if (msg.includes(chapter)) return true;
      return false;
    });

    teacherNotes = teacherNotes.slice(0, 5);
  } catch (err) {
    console.error("Failed to load teacher knowledge:", err);
  }

  const formatTeacherNotes = items => {
    if (!items.length) return "";
    return items.map(item => {
      const title = item.title ? `(${item.title}) ` : "";
      const chapter = item.chapter ? `[${item.chapter}] ` : "";
      const text = (item.text || item.fileText || "").trim();
      return `${chapter}${title}${text}`;
    }).filter(Boolean).join("\n\n");
  };

  const teacherNotesText = formatTeacherNotes(teacherNotes);

  // If a direct hit in book
  if (hit) {
    const pageInfo = hit.page ? ` (Page ${hit.page})` : "";

    const reply = {
      text: `${hit.title_my}${pageInfo}\n\n${hit.about?.description_my || ""}` +
        (teacherNotesText ? `\n\nTeacher Notes:\n${teacherNotesText}` : ""),
      videos: hit.videos || []
    };

    const reply_en = {
      text: `${hit.title_en}${pageInfo}\n\n${hit.about?.description_en || ""}` +
        (teacherNotesText ? `\n\nTeacher Notes:\n${teacherNotesText}` : ""),
      videos: hit.videos || []
    };

    await delay(300);
    return { reply, reply_en };
  }

  // =========================
  // Find related lessons
  // =========================
  let relatedLessons = [];
  if (bookData?.table_of_contents) {
    relatedLessons = bookData.table_of_contents.filter(
      l =>
        message.toLowerCase().includes(l.title_en?.toLowerCase()) ||
        message.toLowerCase().includes(l.title_my)
    );
  }

  // =========================
  // Call AI with context if no exact hit
  // =========================
  const aiReply = await generateAIExplanation({
    grade,
    subject,
    message,
    relatedLessons, // pass related lessons to AI for smarter explanation
    additionalKnowledge: teacherNotesText
  });

  // Format related lessons in reply
  const reply = {
    text: aiReply.my +
      (teacherNotesText ? `\n\nTeacher Notes:\n${teacherNotesText}` : "") +
      (relatedLessons.length ? "\n\nRelated lessons:\n" + relatedLessons.map(l => `${l.title_my} (Page ${l.page})`).join("\n") : ""),
    videos: relatedLessons.flatMap(l => l.videos || [])
  };

  const reply_en = {
    text: aiReply.en +
      (teacherNotesText ? `\n\nTeacher Notes:\n${teacherNotesText}` : "") +
      (relatedLessons.length ? "\n\nRelated lessons:\n" + relatedLessons.map(l => `${l.title_en} (Page ${l.page})`).join("\n") : ""),
    videos: relatedLessons.flatMap(l => l.videos || [])
  };

  return { reply, reply_en };
}

