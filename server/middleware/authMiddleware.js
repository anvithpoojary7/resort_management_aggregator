// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Ensure this path and name are correct (plural 'users')

// Protect routes - Verifies JWT from cookie
const protect = async (req, res, next) => {
  let token;

  // Check if token is in HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Optional: Fallback to Authorization header (Bearer Token), if you support both
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found from either source
  if (!token) {
    console.log('Authentication Failed: No token found in cookies or headers.');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Token decoded:', decoded); // Debugging

    // Find user by ID from the token payload and attach to req
    // Select specific fields for req.user for security (exclude passwordHash)
    const user = await User.findById(decoded.id).select('name email role isGoogleUser');

    if (!user) {
      console.log('Authentication Failed: User not found for decoded ID.');
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach user object to request
    req.user = user; // Now req.user will have _id, name, email, role, etc.
    // console.log('User attached to req:', req.user); // Debugging

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Authentication Error: Token verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token has expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token is invalid' });
  }
};

// Authorize users by roles
const authorize = (roles = []) => {
  // Ensure roles is an array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if req.user was set by the 'protect' middleware
    if (!req.user || !req.user.role) {
      console.log('Authorization Failed: User object or role not available after protection.');
      return res.status(403).json({ message: 'Authorization failed: User role not defined' });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      console.log(`Authorization Failed: User role "${req.user.role}" is not in required roles [${roles.join(', ')}].`);
      return res.status(403).json({ message: `Access denied: Your role (${req.user.role}) is not authorized to access this resource.` });
    }
    next();
  };
};

module.exports = { protect, authorize };