const express = require("express");
const chatbotController = require("../controller/chatbotController");

const router = express.Router();

// 🔍 SAFETY CHECK (IMPORTANT)
if (typeof chatbotController.chatHandler !== "function") {
  throw new Error("chatHandler is not a function. Check controller export.");
}

router.post("/chat", chatbotController.chatHandler);

module.exports = router;
