const express = require('express');
const multer = require('multer');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/listingController');
const { auth, authorize, isVendor } = require('../middleware/auth');
const { checkListingOwnershipForUpdate } = require('../middleware/ownership');
const { validateListingCreation, validateListingUpdate, validateListingFilters } = require('../utils/validators');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// Public routes
router.get('/', validateListingFilters, getListings);
router.get('/:id', getListing);

// Protected routes
router.use(auth); // All routes below require authentication

// Wishlist routes
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:listingId', removeFromWishlist);
router.get('/wishlist/user', getWishlist);

// User routes with validation
router.post('/', upload.array('images', 5), validateListingCreation, createListing);
router.put('/:id', checkListingOwnershipForUpdate, validateListingUpdate, updateListing);
router.delete('/:id', checkListingOwnershipForUpdate, deleteListing);

module.exports = router;

