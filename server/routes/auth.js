const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Owner = require('../models/owner');
const sendVerificationEmail = require('../utils/sendVerification'); 


const requireAuth=require('../middleware/requireAuth');

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { id, email, role } = req.user;
    res.json({ user: { id, email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});



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
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      role,
      passwordHash: hashedPassword,
      verificationCode,
      isVerified: false,
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode); // send code

    if (role === 'owner') {
      await Owner.create({ userId: newUser._id });
    }

    res.status(201).json({
      message: 'Verification code sent to your email',
      userId: newUser._id,
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

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
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
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

    res.json({ message: 'Login successful', user: payload });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


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
      passwordHash: '', 
    });

    await newUser.save();
    if (role === 'owner') {
      await Owner.create({ userId: newUser._id });
    } 

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