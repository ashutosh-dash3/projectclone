const express = require('express');
const {
  getAdvancedListings,
  getListingStats,
  getPopularLocations,
  getSimilarListings
} = require('../controllers/advancedListingController');
const { auth } = require('../middleware/auth');
const { validateListingFilters } = require('../utils/validators');

const router = express.Router();

// Advanced search and filtering
router.get('/', validateListingFilters, getAdvancedListings);

// Statistics and analytics
router.get('/stats', getListingStats);
router.get('/popular-locations', getPopularLocations);

// Similar listings
router.get('/:id/similar', getSimilarListings);

module.exports = router;