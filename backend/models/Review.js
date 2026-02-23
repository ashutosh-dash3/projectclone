const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  isVerifiedStay: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ user: 1, listing: 1 }, { unique: true }); // One review per user per listing

module.exports = mongoose.model('Review', reviewSchema);