const Listing = require('../models/Listing');
const User = require('../models/User');
const AppError = require('../utils/ErrorHandler');

/**
 * Get all listings with filters and pagination
 */
const getAllListings = async (filters = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    city,
    minPrice,
    maxPrice,
    propertyType,
    bedrooms,
    bathrooms,
    search,
    featured,
    owner,
    sort,
    amenity,
    furnished,
    available
  } = filters;

  const queryFilters = { isAvailable: true };

  if (city) queryFilters.city = new RegExp(city, 'i');
  if (propertyType) queryFilters.propertyType = propertyType;
  if (bedrooms) queryFilters.bedrooms = parseInt(bedrooms);
  if (bathrooms) queryFilters.bathrooms = parseInt(bathrooms);
  if (featured === 'true') queryFilters.isFeatured = true;
  if (owner) queryFilters.owner = owner;
  if (available !== undefined) queryFilters.isAvailable = available === 'true';

  // Furnished filter
  if (furnished !== undefined) {
    if (furnished === 'true') {
      queryFilters.amenities = { $in: ['furnished'] };
    } else if (furnished === 'false') {
      queryFilters.amenities = { $nin: ['furnished'] };
    }
  }

  // Amenity filter
  if (amenity) {
    queryFilters.amenities = { $in: [amenity] };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    queryFilters.price = {};
    if (minPrice) queryFilters.price.$gte = parseInt(minPrice);
    if (maxPrice) queryFilters.price.$lte = parseInt(maxPrice);
  }

  // Text search
  if (search) {
    queryFilters.$text = { $search: search };
  }

  // Determine sort order
  let sortOrder = { createdAt: -1 }; // Default: newest first
  if (sort === 'price-low') {
    sortOrder = { price: 1 }; // Price low to high
  } else if (sort === 'price-high') {
    sortOrder = { price: -1 }; // Price high to low
  } else if (sort === 'newest') {
    sortOrder = { createdAt: -1 }; // Newest first
  } else if (sort === 'oldest') {
    sortOrder = { createdAt: 1 }; // Oldest first
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const listings = await Listing.find(queryFilters)
    .populate('owner', 'name email phone')
    .sort(sortOrder)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Listing.countDocuments(queryFilters);

  return {
    listings,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    }
  };
};

/**
 * Get single listing by ID
 */
const getListingById = async (id) => {
  const listing = await Listing.findById(id).populate('owner', 'name email phone');
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }
  return listing;
};

/**
 * Create a new listing
 */
const createListing = async (listingData, ownerId) => {
  const listing = new Listing({
    ...listingData,
    owner: ownerId
  });

  await listing.save();
  await listing.populate('owner', 'name email phone');

  return listing;
};

/**
 * Update a listing
 */
const updateListing = async (id, updateData, userId) => {
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  // Check if user owns the listing
  if (listing.owner.toString() !== userId.toString()) {
    throw new AppError('Not authorized to update this listing', 403);
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('owner', 'name email phone');

  return updatedListing;
};

/**
 * Delete a listing
 */
const deleteListing = async (id, userId) => {
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  // Check if user owns the listing
  if (listing.owner.toString() !== userId.toString()) {
    throw new AppError('Not authorized to delete this listing', 403);
  }

  await Listing.findByIdAndDelete(id);
  return { message: 'Listing deleted successfully' };
};

/**
 * Toggle listing availability
 */
const toggleListingAvailability = async (id, userId) => {
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  // Check if user owns the listing
  if (listing.owner.toString() !== userId.toString()) {
    throw new AppError('Not authorized to update this listing', 403);
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { isAvailable: !listing.isAvailable },
    { new: true }
  );

  return updatedListing;
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  toggleListingAvailability
};