// server/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Assuming your User model is named 'users.js'

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      role,
      passwordHash: hashedPassword, // Store as passwordHash
    });

    await newUser.save();

    const payload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
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
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) { // Check if user exists first
        return res.status(400).json({ message: 'Invalid credentials: User not found' });
    }

    // Use the matchPassword method from the User model if implemented
    // If not, use bcrypt.compare directly
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) { // Then check password
      return res.status(400).json({ message: 'Invalid credentials: Incorrect password' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: 'Access denied: incorrect role for this login type' });
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
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login (if already registered)
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Missing Google user info.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // If user is not found, they should go to google-signup first
      return res.status(404).json({ message: 'No user found. Please sign up first using Google signup.' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: 'Access denied: incorrect role' });
    }
    // Also check if it's indeed a Google user if you want strict separation
    if (!user.isGoogleUser) {
        return res.status(403).json({ message: 'This email is registered with a password. Please use regular login.' });
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
    console.error('Google Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Signup (for new users via Google)
router.post('/google-signup', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Missing Google user info.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Try login instead.' });
    }

    const newUser = new User({
      name,
      email,
      role,
      isGoogleUser: true,
      passwordHash: '', // Google accounts won't have passwords, set as empty string
    });

    await newUser.save();

    const payload = { id: newUser._id, email: newUser.email, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'Google signup successful', user: payload });
  } catch (err) {
    console.error('Google Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;