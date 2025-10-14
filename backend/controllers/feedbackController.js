const Feedback = require('../models/Feedback');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;

    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      rating: rating || 5
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        name: feedback.name,
        subject: feedback.subject,
        message: feedback.message,
        rating: feedback.rating,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};

// Get public feedbacks (for testimonials)
const getPublicFeedbacks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const feedbacks = await Feedback.find({ 
      isPublic: true,
      status: 'resolved'
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name subject message rating createdAt');

    res.json({ feedbacks });
  } catch (error) {
    console.error('Get public feedbacks error:', error);
    res.status(500).json({ message: 'Server error while fetching feedbacks' });
  }
};

// Get all feedbacks (admin only)
const getAllFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(filter);

    res.json({
      feedbacks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({ message: 'Server error while fetching feedbacks' });
  }
};

// Update feedback status (admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isPublic } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status, isPublic },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({
      message: 'Feedback status updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({ message: 'Server error while updating feedback status' });
  }
};

module.exports = {
  submitFeedback,
  getPublicFeedbacks,
  getAllFeedbacks,
  updateFeedbackStatus
};

