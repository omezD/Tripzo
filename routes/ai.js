const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/", (req, res) => {
  res.render("ai.ejs");
});

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `
You are a travel assistant for a travel app called Tripzo.
Only answer travel-related questions.

User question: ${question}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (err) {
    console.error("Gemini SDK Error:", err);
    res.json({
      answer: "Sorry, I couldn't answer that right now.",
    });
  }
});

module.exports = router;
