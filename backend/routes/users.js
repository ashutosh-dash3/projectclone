const express = require('express');
const { auth } = require('../middleware/auth');
const { updateUserProfile, deleteUserAccount } = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user profile
router.get('/profile', (req, res) => {
  // Remove password from user object
  const user = req.user.toJSON ? req.user.toJSON() : req.user;
  delete user.password;
  
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      preferences: user.preferences,
      createdAt: user.createdAt
    }
  });
});

// Update user profile
router.put('/profile', updateUserProfile);

// Delete user account
router.delete('/profile', deleteUserAccount);

module.exports = router;

