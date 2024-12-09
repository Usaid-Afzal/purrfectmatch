// src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const MessageController = require('../controllers/messageController');

// Protected routes
router.post('/', authMiddleware, MessageController.sendMessage);
router.get('/conversation/:userId', authMiddleware, MessageController.getConversation);

module.exports = router;
