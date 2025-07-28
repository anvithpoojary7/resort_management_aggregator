const jwt = require('jsonwebtoken');
const User = require('../models/users'); 

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('Authentication Failed: No token found in cookies or headers.');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find the user in DB
    const user = await User.findById(decoded.id).select('name email role isGoogleUser');

    if (!user) {
      console.log('Authentication Failed: User not found for decoded ID.');
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // ✅ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication Error: Token verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token has expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token is invalid' });
  }
};

module.exports = { protect };
