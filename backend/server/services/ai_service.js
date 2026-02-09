import fs from "fs";
import path from "path";
import { searchBook } from "../utils/searchBook.js";

// Helper delay (for typing effect)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main AI handler
export async function handleAI({ grade, subject, message }) {
  console.log("User input:", message);
  console.log("Grade:", grade, "Subject:", subject);

  // =========================
  // Validation
  // =========================
  if (!grade || !subject) {
    return {
      reply: {
        text: "Please select a grade and subject first.",
        videos: []
      },
      reply_en: {
        text: "Please select a grade and subject first.",
        videos: []
      }
    };
  }

  // =========================
  // Load book JSON
  // =========================
  const filePath = path.resolve(`./data/${grade}/${subject}.json`);

  if (!fs.existsSync(filePath)) {
    return {
      reply: {
        text: "ဝမ်းနည်းပါတယ်၊ ဤအကြောင်းအရာကို စာအုပ်ထဲတွင် မတွေ့ပါ။",
        videos: []
      },
      reply_en: {
        text: "Sorry, I cannot find this topic in the book.",
        videos: []
      }
    };
  }

  const bookData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // =========================
  // Message intent detection
  // =========================
  const wantsExplanation = /(ဘာလဲ|ရှင်းပြ|explain|about)/i.test(message);
  const isLessonQuestion = /(အခန်း|သင်ခန်းစာ|lesson|chapter)\s*\d+/i.test(message);

  // =========================
  // Search content
  // =========================
  const hit = searchBook(message, bookData);

  if (hit) {
    const pageInfo = hit.page ? ` (စာမျက်နှာ ${hit.page})` : "";

    const reply = {
      text:
        (isLessonQuestion || wantsExplanation
          ? `${hit.title_my}${pageInfo}\n\n${hit.about?.description_my || ""}`
          : `${hit.title_my}${pageInfo} ဖြစ်ပါတယ်`),
      videos: hit.videos || []
    };

    const reply_en = {
      text:
        (isLessonQuestion || wantsExplanation
          ? `${hit.title_en}${pageInfo}\n\n${hit.about?.description_en || ""}`
          : `${hit.title_en}${pageInfo}`),
      videos: hit.videos || []
    };

    await delay(1000);

    console.log("Found -> MY:", reply.text);
    console.log("Found -> EN:", reply_en.text);
    console.log("Videos:", reply.videos?.length || 0);

    return { reply, reply_en };
  }

  // =========================
  // Not found fallback
  // =========================
  await delay(1000);

  return {
    reply: {
      text: "ဝမ်းနည်းပါတယ်၊ ဤအကြောင်းအရာကို စာအုပ်ထဲတွင် မတွေ့ပါ။",
      videos: []
    },
    reply_en: {
      text: "Sorry, I cannot find this topic in the book.",
      videos: []
    }
  };
}
