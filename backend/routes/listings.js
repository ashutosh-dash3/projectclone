const express = require('express');
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
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListing);

// Protected routes
router.use(auth); // All routes below require authentication

// Wishlist routes
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:listingId', removeFromWishlist);
router.get('/wishlist/user', getWishlist);

// Owner routes
router.post('/', authorize('owner'), createListing);
router.put('/:id', authorize('owner'), updateListing);
router.delete('/:id', authorize('owner'), deleteListing);

module.exports = router;

