const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatBotReply = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `You are a helpful assistant for the RentConnect car rental platform.\nUser: ${message}`
    );

    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.json({
      reply: "⚠️ Chatbot is temporarily unavailable. Please try again later.",
    });
  }
};
