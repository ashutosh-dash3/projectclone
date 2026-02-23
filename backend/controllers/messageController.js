const messageService = require('../services/messageService');
const {
  sendMessage,
  getConversation,
  getMessages,
  getUserConversations,
  markMessagesAsRead,
  getOrCreateConversation
} = messageService;
const AppError = require('../utils/ErrorHandler');

/**
 * Send a message
 */
const createMessage = async (req, res, next) => {
  try {
    const { receiverId, listingId, content } = req.body;
    const senderId = req.user._id;

    const message = await sendMessage(senderId, receiverId, listingId, content);

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages for a conversation
 */
const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const messages = await getMessages(conversationId, userId, parseInt(page), parseInt(limit));

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's conversations
 */
const getUserConversationsList = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await getUserConversations(userId);

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

/**
 * Get or create conversation between two users for a specific listing
 */
const getOrCreateConversationController = async (req, res, next) => {
  try {
    const { userId, listingId } = req.params;
    const currentUserId = req.user._id;

    const participantIds = [currentUserId, userId].sort();
    
    const conversation = await messageService.getOrCreateConversation(participantIds, listingId);

    res.json({ conversation });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark messages as read
 */
const markConversationMessagesAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await markMessagesAsRead(conversationId, userId);

    res.json({ message: 'Messages marked as read successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getConversationMessages,
  getUserConversationsList,
  getOrCreateConversationController,
  markConversationMessagesAsRead
};