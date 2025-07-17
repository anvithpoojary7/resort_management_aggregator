const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // We only need the User model now
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// This endpoint remains the same
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { id, email, role } = req.user;
    res.json({ user: { id, email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// ✅ Simplified Registration
router.post('/register', async (req, res) => {
  try {
    // We no longer need 'role' from the request body
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // The 'role' will be set to 'user' by default from the schema
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
    });
    await newUser.save();

    // The logic for creating an 'owner' is now removed.

    const payload = { id: newUser._id, email: newUser.email, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: payload,
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Simplified Login
router.post('/login', async (req, res) => {
  try {
    // We no longer need 'role' from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // The check for different roles is removed.

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

// ✅ Simplified Google Login
router.post('/google-login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Missing Google user info.' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user found. Please sign up first.' });
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

// ✅ Simplified Google Signup
router.post('/google-signup', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Missing Google user info.' });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists. Try login instead.' });
        }

        const newUser = new User({
            name,
            email,
            isGoogleUser: true,
            passwordHash: ''
            // 'role' is automatically set to 'user' by default
        });
        await newUser.save();

        // Removed the 'owner' logic

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