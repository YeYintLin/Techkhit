import axios from "axios";

export async function translate(text, direction) {
  const res = await axios.post("http://localhost:8000/translate", {
    text,
    direction
  });
  return res.data.translation;
}
