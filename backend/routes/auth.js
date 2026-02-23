const express = require('express');
const { register, login, getCurrentUser, updateProfile } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleAuthController');
const { changePassword } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../utils/validators');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/google-login', googleLogin);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.post('/change-password', auth, changePassword);

module.exports = router;

