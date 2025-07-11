/*const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner'); // adjust if your schema file is named differently
const admin = require('firebase-admin');

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.ownerId = decodedToken.uid;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// @route   GET /api/owner/profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const owner = await Owner.findOne({ firebaseUid: req.ownerId });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    res.json(owner);
  } catch (error) {
    console.error('Error fetching owner profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;*/
