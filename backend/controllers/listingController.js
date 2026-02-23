const Listing = require('../models/Listing');
const Wishlist = require('../models/Wishlist');
const {
  getAllListings,
  getListingById,
  createListing: createListingService,
  updateListing: updateListingService,
  deleteListing: deleteListingService,
  toggleListingAvailability
} = require('../services/listingService');

// Get all listings with filters
const getListings = async (req, res, next) => {
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

    // Build filters dynamically - only include non-empty values
    const filters = { page, limit };
    
    if (city && city.trim() !== '') filters.city = city.trim();
    if (minPrice && minPrice.trim() !== '') filters.minPrice = parseInt(minPrice);
    if (maxPrice && maxPrice.trim() !== '') filters.maxPrice = parseInt(maxPrice);
    if (propertyType && propertyType.trim() !== '') filters.propertyType = propertyType.trim();
    if (bedrooms && bedrooms.trim() !== '') filters.bedrooms = parseInt(bedrooms);
    if (bathrooms && bathrooms.trim() !== '') filters.bathrooms = parseInt(bathrooms);
    if (search && search.trim() !== '') filters.search = search.trim();
    if (featured && featured.trim() !== '') filters.featured = featured.trim();
    if (owner && owner.trim() !== '') filters.owner = owner.trim();

    const options = { sort: { createdAt: -1 } };

    const result = await getAllListings(filters, options);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error while fetching listings' });
  }
};

// Get single listing
const getListing = async (req, res, next) => {
  try {
    const listing = await getListingById(req.params.id);
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

// Create new listing
const createListing = async (req, res, next) => {
  try {
    // Handle file uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      // In production, you would upload to cloud storage
      // For now, we'll store the filenames
      req.files.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    }
    
    // Parse form data - handle both JSON body and FormData
    let bodyData = req.body;
    
    // If data is sent as JSON string in FormData
    if (req.body.data) {
      try {
        bodyData = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON data'
        });
      }
    }
    
    // Convert form data to proper types
    const listingData = {
      title: bodyData.title,
      description: bodyData.description,
      price: Number(bodyData.price),
      city: bodyData.city,
      address: bodyData.address,
      propertyType: bodyData.propertyType,
      bedrooms: bodyData.bedrooms ? Number(bodyData.bedrooms) : undefined,
      bathrooms: bodyData.bathrooms ? Number(bodyData.bathrooms) : undefined,
      size: bodyData.size || undefined,
      amenities: Array.isArray(bodyData.amenities) ? bodyData.amenities : (bodyData.amenities ? [bodyData.amenities] : []),
      images: images,
      owner: req.user._id
    };
    
    // Add property type specific fields
    if (bodyData.propertyType === 'pg') {
      listingData.pgFood = bodyData.pgFood || 'no';
      listingData.pgWifi = bodyData.pgWifi || 'no';
      listingData.pgCharges = bodyData.pgCharges ? Number(bodyData.pgCharges) : 0;
    } else if (bodyData.propertyType === 'room') {
      listingData.roomOwnBed = bodyData.roomOwnBed || 'yes';
    } else if (bodyData.propertyType === 'flat' || bodyData.propertyType === 'apartment') {
      listingData.flatBhk = bodyData.flatBhk ? Number(bodyData.flatBhk) : 1;
      listingData.flatFacilities = bodyData.flatFacilities || '';
    }
    
    // Validate required fields
    if (!listingData.title || listingData.title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    if (!listingData.price || listingData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }
    
    if (!listingData.city || listingData.city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'City is required'
      });
    }
    
    if (!listingData.address || listingData.address.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }
    
    if (!listingData.description || listingData.description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    // Validate PG charges if property type is PG
    if (bodyData.propertyType === 'pg' && (!bodyData.pgCharges || Number(bodyData.pgCharges) <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'PG charges are required for PG properties'
      });
    }
    
    // Validate images
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one photo is required'
      });
    }
    
    if (images.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 photos allowed'
      });
    }
    
    const listing = await createListingService(listingData, req.user._id);
    
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    next(error);
  }
};

// Update listing
const updateListing = async (req, res, next) => {
  try {
    const updatedListing = await updateListingService(req.params.id, req.body, req.user._id);

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    next(error);
  }
};

// Delete listing
const deleteListing = async (req, res, next) => {
  try {
    const result = await deleteListingService(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
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

