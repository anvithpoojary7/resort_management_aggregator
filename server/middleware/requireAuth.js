
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication Failed: Authorization token in "Bearer <token>" format required.' });
  }

  const token = authorization.split(' ')[1];

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    req.user = { id: decoded.id, role: decoded.role };


    next();

  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(401).json({ message: 'Authentication Failed: Invalid token.' });
  }
};

module.exports = requireAuth;