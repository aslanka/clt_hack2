const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// POST endpoint for handling chat requests
router.post("/chat", chatbotController.getChatResponse);


module.exports = router;