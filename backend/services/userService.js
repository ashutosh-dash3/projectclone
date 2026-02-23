const User = require('../models/User');
const AppError = require('../utils/ErrorHandler');

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Create a new user
 */
const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  const user = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'tenant',
    phone: userData.phone
  });

  await user.save();
  return user;
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Update user's unread messages count
 */
const updateUserUnreadMessagesCount = async (userId, increment = true) => {
  const updateValue = increment ? 1 : -1;
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { unreadMessagesCount: updateValue } },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUserProfile,
  updateUserUnreadMessagesCount
};