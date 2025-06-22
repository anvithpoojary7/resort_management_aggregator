const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
    });

    await newUser.save();

    // Create JWT payload
    const payload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    // Sign the JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', user: payload });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// GOOGLE LOGIN
router.post('/google-login', async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    // If user doesn't exist, register them
    if (!user) {
      user = new User({
        name,
        email,
        passwordHash: '', // not needed for Google login
      });
      await user.save();
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Google login successful', user: payload });
  } catch (err) {
    console.error('Google Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
