const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');   


const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!email || !password || !adminKey) {
      return res.status(400).json({ message: 'Email, password, and admin key are required.' });
    }

  
    if (adminKey !== process.env.ADMIN_PASS_KEY) {
      return res.status(401).json({ message: 'Invalid admin key.' });
    }

  
    const user = await User.findOne({ email, role: 'admin' }); 
    if (!user) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .json({ message: 'Admin login successful', user: payload });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
