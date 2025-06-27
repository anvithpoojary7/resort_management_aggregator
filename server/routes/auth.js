const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  console.log("🛑 EARLY REGISTER HIT – body:", req.body);

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      role,
      passwordHash: hashedPassword,
    });

    await newUser.save();

    const payload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    let token;
    try {
      token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
    } catch (err) {
      console.error("❌ JWT sign failed:", err);
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Registration successful:", payload);
    res.status(201).json({
      message: 'User registered successfully',
      user: payload,
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log("👉 LOGIN HIT with:", req.body);
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      console.log("⚠️ Role mismatch: user role is", user.role, ", attempted login as", role);
      return res.status(403).json({ message: 'Access denied: incorrect role' });
    }

    const payload = { id: user._id, email: user.email, role: user.role };

    let token;
    try {
      token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
    } catch (err) {
      console.error("❌ JWT sign failed:", err);
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login successful:", payload);
    res.json({ message: 'Login successful', user: payload });

  } catch (err) {
<<<<<<< Updated upstream
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Missing Google user info.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found. Please sign up first.' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: 'Access denied: incorrect role' });
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
=======
    console.error('❌ Login Error:', err);
>>>>>>> Stashed changes
    res.status(500).json({ message: 'Server error' });
  }
});

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
      passwordHash: '', // Google accounts won't have passwords
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
