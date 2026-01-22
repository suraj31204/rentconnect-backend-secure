const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      reply: "⚠️ Chatbot is temporarily unavailable. Please try again later.",
    });
  }
};
