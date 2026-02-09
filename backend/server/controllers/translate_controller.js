// backend/controllers/translate.controller.js
import { translate } from "../services/translator_service.js";

// Handles POST /translate
export async function translateController(req, res) {
  try {
    const { text, direction } = req.body;

    if (!text || !direction) {
      return res.status(400).json({ error: "Missing text or direction" });
    }

    const translation = await translate(text, direction);
    res.json({ translation });
  } catch (err) {
    console.error("❌ Translation Controller Error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
}
