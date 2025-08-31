
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  console.log('🔐 Incoming Authorization header:', authHeader);
  
  // Check for token in cookies
  const tokenCookie = req.cookies?.jwt;
  console.log('🍪 Incoming JWT cookie:', tokenCookie);
  
  let token;
  
  // Get token from header or cookie
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenCookie) {
    token = tokenCookie;
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Make sure _id is available for routes that expect it
      req.user = {
        ...decoded,
        _id: decoded.id
      };
      next();
    } catch (err) {
      console.error('❌ JWT Error:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
