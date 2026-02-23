const Listing = require('../models/Listing');
const AppError = require('../utils/ErrorHandler');

/**
 * Check if user owns the listing
 */
const checkListingOwnership = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return next(new AppError('Listing not found', 404));
    }

    // Check if user owns the listing
    if (listing.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to access this listing', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user owns the listing (for update/delete operations)
 */
const checkListingOwnershipForUpdate = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return next(new AppError('Listing not found', 404));
    }

    // Check if user owns the listing
    if (listing.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to update this listing', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkListingOwnership, checkListingOwnershipForUpdate };