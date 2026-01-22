const express = require("express");
const { chatBotReply } = require("../controller/chatbotController");

const router = express.Router();

router.post("/chat", chatBotReply);

module.exports = router;
