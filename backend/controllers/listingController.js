const Listing = require('../models/Listing');
const Wishlist = require('../models/Wishlist');

// Get all listings with filters
const getListings = async (req, res) => {
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
      owner
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };

    if (city) filter.city = new RegExp(city, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms);
    if (featured === 'true') filter.isFeatured = true;
    if (owner) filter.owner = owner;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error while fetching listings' });
  }
};

// Get single listing
const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error while fetching listing' });
  }
};

// Create new listing
const createListing = async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      owner: req.user._id
    };

    const listing = new Listing(listingData);
    await listing.save();

    await listing.populate('owner', 'name email phone');

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error while creating listing' });
  }
};

// Update listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error while updating listing' });
  }
};

// Delete listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error while deleting listing' });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.user._id;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({ user: userId, listing: listingId });
    if (existingWishlist) {
      return res.status(400).json({ message: 'Listing already in wishlist' });
    }

    const wishlistItem = new Wishlist({ user: userId, listing: listingId });
    await wishlistItem.save();

    res.json({ message: 'Added to wishlist successfully' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user._id;

    const wishlistItem = await Wishlist.findOneAndDelete({ 
      user: userId, 
      listing: listingId 
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Listing not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlistItems = await Wishlist.find({ user: userId })
      .populate({
        path: 'listing',
        populate: {
          path: 'owner',
          select: 'name email phone'
        }
      });

    const listings = wishlistItems.map(item => item.listing);

    res.json({ listings });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};

module.exports = {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  addToWishlist,
  removeFromWishlist,
  getWishlist
};

