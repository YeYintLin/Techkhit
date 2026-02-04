import { handleAI } from "../services/ai_service.js";

export async function chat(req, res) {
  try {
    const result = await handleAI(req.body.message);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "AI failed" });
  }
}
