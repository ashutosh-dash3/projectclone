const express = require('express');
const {
  submitFeedback,
  getPublicFeedbacks,
  getAllFeedbacks,
  updateFeedbackStatus
} = require('../controllers/feedbackController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', submitFeedback);
router.get('/public', getPublicFeedbacks);

// Admin routes (for now, any authenticated user can access)
router.get('/all', auth, getAllFeedbacks);
router.put('/:id/status', auth, updateFeedbackStatus);

module.exports = router;

