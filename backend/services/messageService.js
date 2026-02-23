const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Listing = require('../models/Listing');
const AppError = require('../utils/ErrorHandler');

/**
 * Create a new conversation or get existing one
 */
const getOrCreateConversation = async (participantIds, listingId) => {
  // Check if conversation already exists with the same participants and listing
  let conversation = await Conversation.findOne({
    participants: { $all: participantIds, $size: participantIds.length },
    listing: listingId
  });

  if (!conversation) {
    conversation = new Conversation({
      participants: participantIds,
      listing: listingId
    });
    await conversation.save();
  }

  return conversation;
};

/**
 * Send a message
 */
const sendMessage = async (senderId, receiverId, listingId, content) => {
  // Validate that sender and receiver exist
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  const listing = await Listing.findById(listingId);

  if (!sender || !receiver || !listing) {
    throw new AppError('Sender, receiver, or listing not found', 404);
  }

  // Get or create conversation
  const participantIds = [senderId, receiverId].sort(); // Sort to ensure consistency
  const conversation = await getOrCreateConversation(participantIds, listingId);

  // Create the message
  const message = new Message({
    conversationId: conversation._id,
    sender: senderId,
    receiver: receiverId,
    listing: listingId,
    content: content
  });

  await message.save();

  // Update conversation with last message info
  await Conversation.findByIdAndUpdate(conversation._id, {
    lastMessage: content.substring(0, 100), // First 100 chars
    lastMessageAt: new Date()
  });

  // Increment receiver's unread messages count
  await User.findByIdAndUpdate(receiverId, {
    $inc: { unreadMessagesCount: 1 }
  });

  // Populate the message before returning
  await message.populate([
    { path: 'sender', select: 'name email' },
    { path: 'receiver', select: 'name email' },
    { path: 'listing', select: 'title' }
  ]);

  return message;
};

/**
 * Get conversation between two users for a specific listing
 */
const getConversation = async (userId1, userId2, listingId) => {
  const participantIds = [userId1, userId2].sort();
  const conversation = await Conversation.findOne({
    participants: { $all: participantIds, $size: participantIds.length },
    listing: listingId
  });

  if (!conversation) {
    throw new AppError('No conversation found for this listing', 404);
  }

  return conversation;
};

/**
 * Get messages in a conversation
 */
const getMessages = async (conversationId, userId, page = 1, limit = 20) => {
  // Verify user is part of the conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (!conversation.participants.includes(userId)) {
    throw new AppError('Not authorized to view this conversation', 403);
  }

  // Mark messages as read
  await Message.updateMany(
    { 
      conversationId, 
      receiver: userId, 
      read: false 
    },
    { 
      read: true, 
      readAt: new Date() 
    }
  );

  // Decrement user's unread messages count
  const unreadCount = await Message.countDocuments({
    receiver: userId,
    read: false
  });

  await User.findByIdAndUpdate(userId, {
    unreadMessagesCount: unreadCount
  });

  // Get messages
  const skip = (page - 1) * limit;
  const messages = await Message.find({ conversationId })
    .populate([
      { path: 'sender', select: 'name email' },
      { path: 'receiver', select: 'name email' },
      { path: 'listing', select: 'title' }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return messages.reverse(); // Return in chronological order (oldest first)
};

/**
 * Get user conversations
 */
const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
    isActive: true
  })
    .populate([
      { path: 'participants', select: 'name email role' },
      { path: 'listing', select: 'title images city' }
    ])
    .sort({ lastMessageAt: -1 });

  // Add unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conversation) => {
      const otherParticipant = conversation.participants.find(p => p._id.toString() !== userId.toString());
      
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        receiver: userId,
        read: false
      });

      return {
        ...conversation.toObject(),
        otherParticipant,
        unreadCount
      };
    })
  );

  return conversationsWithUnread;
};

/**
 * Mark messages as read
 */
const markMessagesAsRead = async (conversationId, userId) => {
  const result = await Message.updateMany(
    { 
      conversationId, 
      receiver: userId, 
      read: false 
    },
    { 
      read: true, 
      readAt: new Date() 
    }
  );

  // Update user's unread messages count
  const totalUnread = await Message.countDocuments({
    receiver: userId,
    read: false
  });

  await User.findByIdAndUpdate(userId, {
    unreadMessagesCount: totalUnread
  });

  return result;
};

module.exports = {
  sendMessage,
  getConversation,
  getMessages,
  getUserConversations,
  markMessagesAsRead,
  getOrCreateConversation
};