
const jwt = require('jsonwebtoken');
const User = require('../models/users'); 

const protect = async (req, res, next) => {
  let token;

 
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;x
  }
 
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  
  if (!token) {
    console.log('Authentication Failed: No token found in cookies or headers.');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    const user = await User.findById(decoded.id).select('name email role isGoogleUser');

    if (!user) {
      console.log('Authentication Failed: User not found for decoded ID.');
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    
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


const authorize = (roles = []) => {

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
   
    if (!req.user || !req.user.role) {
      console.log('Authorization Failed: User object or role not available after protection.');
      return res.status(403).json({ message: 'Authorization failed: User role not defined' });
    }

    
    if (!roles.includes(req.user.role)) {
      console.log(`Authorization Failed: User role "${req.user.role}" is not in required roles [${roles.join(', ')}].`);
      return res.status(403).json({ message: `Access denied: Your role (${req.user.role}) is not authorized to access this resource.` });
    }
    next();
  };
};

module.exports = { protect, authorize };