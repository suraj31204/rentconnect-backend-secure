const express = require("express");
const { chatHandler } = require("../controller/chatbotController");

const router = express.Router();

router.post("/chat", chatHandler);

export default router;
