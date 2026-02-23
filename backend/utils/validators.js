const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['tenant', 'vendor', 'admin'])
    .withMessage('Role must be tenant, vendor, or admin'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Listing validation rules
const validateListingCreation = [
  body('title')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Title must be between 10 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('price')
    .isFloat({ min: 1 })
    .withMessage('Price must be a positive number'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('propertyType')
    .isIn(['apartment', 'house', 'studio', 'pg'])
    .withMessage('Property type must be apartment, house, studio, or pg'),
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a non-negative integer'),
  body('size')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Size is required'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  body('pgFood')
    .optional()
    .isIn(['yes', 'no'])
    .withMessage('PG Food must be yes or no'),
  body('pgWifi')
    .optional()
    .isIn(['yes', 'no'])
    .withMessage('PG WiFi must be yes or no'),
  body('pgCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('PG Charges must be a positive number'),
  body('roomOwnBed')
    .optional()
    .isIn(['yes', 'no'])
    .withMessage('Room Own Bed must be yes or no'),
  body('flatBhk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Flat BHK must be a positive integer'),
  body('flatFacilities')
    .optional()
    .trim(),
  handleValidationErrors
];

const validateListingUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('propertyType')
    .optional()
    .isIn(['apartment', 'house', 'studio', 'shared', 'pg'])
    .withMessage('Property type must be apartment, house, studio, shared, or pg'),
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a non-negative integer'),
  body('size')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Size is required'),
  handleValidationErrors
];

// Message validation rules
const validateSendMessage = [
  body('receiverId')
    .isMongoId()
    .withMessage('Receiver ID must be a valid MongoDB ID'),
  body('listingId')
    .isMongoId()
    .withMessage('Listing ID must be a valid MongoDB ID'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  handleValidationErrors
];

// Query validation for filtering
const validateListingFilters = [
  query('page')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return !isNaN(value) && parseInt(value) >= 1;
    })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return !isNaN(value) && parseInt(value) >= 1 && parseInt(value) <= 100;
    })
    .withMessage('Limit must be between 1 and 100'),
  query('minPrice')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return !isNaN(value) && parseFloat(value) >= 0;
    })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return !isNaN(value) && parseFloat(value) >= 0;
    })
    .withMessage('Maximum price must be a positive number'),
  query('propertyType')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return ['apartment', 'house', 'studio', 'shared', 'pg'].includes(value);
    })
    .withMessage('Property type must be apartment, house, studio, shared, or pg'),
  query('bedrooms')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return !isNaN(value) && parseInt(value) >= 0;
    })
    .withMessage('Bedrooms must be a non-negative integer'),
  query('bathrooms')
    .optional()
    .custom((value) => {
      if (value === '' || value === undefined) return true;
      return !isNaN(value) && parseInt(value) >= 0;
    })
    .withMessage('Bathrooms must be a non-negative integer'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateListingCreation,
  validateListingUpdate,
  validateSendMessage,
  validateListingFilters
};