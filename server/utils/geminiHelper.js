const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callGemini = async (prompt) => {
  let lastErr;
  for (const name of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json|```/g, "").trim();
        return JSON.parse(text);
      } catch (err) {
        lastErr = err;
        console.error(`[Gemini] ${name} attempt ${attempt + 1} failed: ${err.message}`);
        if (err.status === 503 || err.status === 429) await sleep(1500);
        else break; // other errors: skip to next model
      }
    }
  }
  throw new Error("AI is busy right now, please try again in a minute");
};

module.exports = callGemini;