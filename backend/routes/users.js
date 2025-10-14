const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      preferences: req.user.preferences,
      createdAt: req.user.createdAt
    }
  });
});

module.exports = router;

