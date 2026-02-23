const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Google Sign-In
const googleLogin = async (req, res) => {
  try {
    const { tokenId, userInfo } = req.body;
    
    if (!tokenId || !userInfo) {
      return res.status(400).json({
        success: false,
        message: 'Token ID and user info are required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: userInfo.email });

    if (user) {
      // User exists, update their info if needed
      user.name = userInfo.name;
      user.profileImage = userInfo.picture || user.profileImage;
      user.googleId = userInfo.googleId;
      
      // If user was previously a regular user, upgrade to Google user
      if (!user.googleId) {
        user.googleId = userInfo.googleId;
      }
      
      await user.save();
    } else {
      // Create new user
      user = new User({
        name: userInfo.name,
        email: userInfo.email,
        password: tokenId, // We'll use the token as a placeholder password
        profileImage: userInfo.picture || '',
        googleId: userInfo.googleId,
        isVerified: true, // Google users are automatically verified
        role: 'tenant'
      });
      
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during Google login'
    });
  }
};

module.exports = {
  googleLogin
};