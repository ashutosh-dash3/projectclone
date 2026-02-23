const express = require('express');
const {
  createMessage,
  getConversationMessages,
  getUserConversationsList,
  getOrCreateConversationController,
  markConversationMessagesAsRead
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');
const { validateSendMessage } = require('../utils/validators');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Send a message
router.post('/', validateSendMessage, createMessage);

// Get user's conversations
router.get('/conversations', getUserConversationsList);

// Get messages for a specific conversation
router.get('/conversation/:conversationId/messages', getConversationMessages);

// Mark messages as read
router.patch('/conversation/:conversationId/read', markConversationMessagesAsRead);

// Get or create conversation between two users for a listing
router.get('/conversation/:userId/listing/:listingId', getOrCreateConversationController);

module.exports = router;