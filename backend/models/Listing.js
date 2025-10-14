const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'studio', 'shared', 'pg'],
    required: true
  },
  bedrooms: {
    type: Number,
    required: true,
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: true,
    min: [0, 'Bathrooms cannot be negative']
  },
  size: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  amenities: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  contactInfo: {
    phone: String,
    email: String,
    whatsapp: String
  },
  rules: [String],
  nearbyPlaces: [{
    name: String,
    distance: String,
    type: String
  }]
}, {
  timestamps: true
});

// Index for text search
listingSchema.index({ title: 'text', description: 'text', city: 'text' });

// Index for location-based queries
listingSchema.index({ location: '2dsphere' });

// Index for filtering
listingSchema.index({ city: 1, price: 1, propertyType: 1, isAvailable: 1 });

module.exports = mongoose.model('Listing', listingSchema);

