const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResponse = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return sendResponse(res, 401, false, 'User not found or authorization failed');
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return sendResponse(res, 401, false, 'Not authorized, token invalid or expired');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token provided');
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return sendResponse(res, 403, false, 'Access denied: Admin privileges required');
  }
};

module.exports = { protect, admin };
