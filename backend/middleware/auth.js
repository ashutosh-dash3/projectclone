const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/ErrorHandler');

const auth = async (req, res, next) => {
  try {
    console.log('Authorization header received:', req.header('Authorization'));
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token ? 'found' : 'not found');
    console.log('Raw token value:', token);
    
    if (!token) {
      console.log('No token found in Authorization header');
      return next(new AppError('No token, authorization denied', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next(new AppError('Token is not valid', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again!', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired! Please log in again.', 401));
    }
    return next(new AppError('Token is not valid', 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. No user found.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403));
    }

    next();
  };
};

// Specific authorization functions for tenant and vendor
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. No user found.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

// Middleware to check if user is vendor
const isVendor = (req, res, next) => {
  if (req.user.role !== 'vendor') {
    return next(new AppError('Access restricted to vendors only', 403));
  }
  next();
};

// Middleware to check if user is tenant
const isTenant = (req, res, next) => {
  if (req.user.role !== 'tenant') {
    return next(new AppError('Access restricted to tenants only', 403));
  }
  next();
};

module.exports = { auth, authorize, restrictTo, isVendor, isTenant };

