const {
  getAllListings,
  getListingById
} = require('../services/listingService');
const Listing = require('../models/Listing');
const AppError = require('../utils/ErrorHandler');

/**
 * Get listings by location (geospatial search)
 */
const getListingsByLocation = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters
    
    if (!lat || !lng) {
      return next(new AppError('Latitude and longitude are required for location search', 400));
    }

    const listings = await Listing.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).populate('owner', 'name email phone');

    res.json({ listings });
  } catch (error) {
    next(error);
  }
};

/**
 * Get listings with advanced filters
 */
const getAdvancedListings = async (req, res, next) => {
  try {
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
      available,
      minArea,
      maxArea
    } = req.query;

    const filters = {
      page,
      limit,
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
    };

    // Additional filters
    if (minArea) filters.minArea = minArea;
    if (maxArea) filters.maxArea = maxArea;

    const options = { sort: sort ? sort : { createdAt: -1 } };

    const result = await getAllListings(filters, options);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get listing statistics
 */
const getListingStats = async (req, res, next) => {
  try {
    const stats = await Listing.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const totalListings = await Listing.countDocuments();
    const availableListings = await Listing.countDocuments({ isAvailable: true });
    const unavailableListings = totalListings - availableListings;

    res.json({
      totalListings,
      availableListings,
      unavailableListings,
      propertyTypes: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular locations
 */
const getPopularLocations = async (req, res, next) => {
  try {
    const locations = await Listing.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({ locations });
  } catch (error) {
    next(error);
  }
};

/**
 * Get similar listings
 */
const getSimilarListings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await getListingById(id);

    if (!listing) {
      return next(new AppError('Listing not found', 404));
    }

    // Find similar listings based on property type, city, and price range
    const similarListings = await Listing.find({
      _id: { $ne: id }, // Exclude the current listing
      propertyType: listing.propertyType,
      city: { $regex: new RegExp(listing.city, 'i') },
      price: {
        $gte: listing.price * 0.8, // Within 20% lower
        $lte: listing.price * 1.2  // Within 20% higher
      },
      isAvailable: true
    })
    .populate('owner', 'name email phone')
    .limit(6);

    res.json({ listings: similarListings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListingsByLocation,
  getAdvancedListings,
  getListingStats,
  getPopularLocations,
  getSimilarListings
};