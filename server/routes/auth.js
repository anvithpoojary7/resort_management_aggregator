const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const sendVerificationEmail = require('../utils/sendVerification');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// ✅ Get current logged-in user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// ✅ Registration with email verification
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password will be hashed by pre-save hook
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email: normalizedEmail,
      passwordHash: password, // plain password
      verificationCode,
      isVerified: false,
    });

    await newUser.save();
    await sendVerificationEmail(normalizedEmail, verificationCode);

    const payload = { id: newUser._id, email: newUser.email, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'User registered successfully. Check your email to verify.',
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

// ✅ Email verification
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();
      return res.json({ message: 'Email verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: 'Login successful',
      token, // ✅ Added here
      user: payload,
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


router.post('/google-signup', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email: normalizedEmail,
      isGoogleUser: true,
      passwordHash: '',
    });

    await newUser.save();

    const payload = {
      id: newUser._id,
      name: newUser.name, 
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: payload });
  } catch (err) {
    console.error('Google signup error:', err);
    res.status(500).json({ message: 'Google signup failed' });
  }
});


router.post('/google-login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.isGoogleUser) {
      return res.status(404).json({ message: 'Google user not found' });
    }

    const payload = {
      id: user._id,
      name: user.name, 
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: payload });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
});

module.exports = router;
