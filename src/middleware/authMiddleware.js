const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // We might need to install this or just use try-catch
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, User not found' });
      }

      // Check if token version matches user version
      if (decoded.tokenVersion !== user.tokenVersion) {
        return res.status(401).json({ success: false, message: 'Not authorized, Token invalid' });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, Authentication failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, Authentication failed' });
  }
};
