import axios from "axios";

const TRANSLATOR_URL = process.env.TRANSLATOR_URL || "http://localhost:8000";

export async function translate(text, direction) {
  const res = await axios.post(`${TRANSLATOR_URL}/translate`, {
    text,
    direction
  });
  return res.data.translation;
}
