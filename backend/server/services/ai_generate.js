export async function generateAIExplanation({ grade, subject, message, relatedLessons = [], additionalKnowledge = "" }) {
  try {
    // Include related lessons in prompt if available
    const relatedText = relatedLessons.length
      ? "Here are some related lessons: " + relatedLessons.map(l => `${l.title_my} (${l.page})`).join(", ")
      : "";
    const knowledgeText = additionalKnowledge && additionalKnowledge.trim()
      ? "Teacher added knowledge:\n" + additionalKnowledge.trim()
      : "";

    const prompt = `
You are a knowledgeable teacher.
Explain clearly to a Grade ${grade} student studying ${subject}.
User asked: "${message}"
${relatedText ? relatedText : ""}
${knowledgeText ? knowledgeText : ""}
If you don't know based on lessons, answer freely using your own knowledge.
Answer in Burmese (my) and English (en) in JSON format strictly:
{
  "my_text": "... Burmese explanation ...",
  "en_text": "... English explanation ..."
}
Do not add anything outside the JSON.
`;

    const res = await fetch("http://localhost:11434/api/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt,
        max_tokens: 500,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`AI server error ${res.status}: ${text}`);
    }

    let data;
    try {
      // Extract JSON safely in case AI adds extra text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        data = JSON.parse(match[0]);
      } else {
        // fallback: if no JSON, return entire text as both languages
        data = { my_text: text, en_text: text };
      }
    } catch (jsonErr) {
      console.error("AI returned invalid JSON:", jsonErr, text);
      data = { my_text: text, en_text: text };
    }

    return {
      my: data?.my_text?.trim() || "AI could not generate an answer.",
      en: data?.en_text?.trim() || "AI could not generate an answer."
    };

  } catch (err) {
    console.error("AI generation failed:", err);
    return {
      my: "AI server not available. Please try again later.",
      en: "AI server not available. Please try again later."
    };
  }
}

