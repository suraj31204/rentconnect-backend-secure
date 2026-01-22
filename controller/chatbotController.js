const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatBotReply = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ CORRECT MODEL
    });

    const result = await model.generateContent(req.body.message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini backend error:", error.message);
    res.json({
      reply: "⚠️ Chatbot is temporarily unavailable. Please try again later.",
    });
  }
};
