const express=require('express');
const router=express.Router();
const User=require('../models/users');
const bcrypt=require('bcryptjs');
const protect=require('../middleware/auth');

router.get('/profile', protect, async (req, res) => {
  try {
      console.log('req.user in /profile:', req.user);
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports=router;
