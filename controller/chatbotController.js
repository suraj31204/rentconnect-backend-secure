const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithBot = async (req, res) => {
  try {
    console.log("🟢 /api/chat hit");
    console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "FOUND" : "MISSING");

    const { message } = req.body;
    console.log("📩 Message:", message);

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    console.log("🤖 Reply:", reply);

    return res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini FULL error:", error);

    return res.status(500).json({
      reply: "⚠️ Chatbot is temporarily unavailable. Please try again later.",
    });
  }
};

module.exports = { chatWithBot };
