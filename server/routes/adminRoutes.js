const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Reservation = require('../models/reservation');


router.get('/users', async (req, res) => {
  try {

    const bookedUserIds = await Reservation.distinct('userId');

    
    const users = await User.find({ _id: { $in: bookedUserIds } }, '-passwordHash');

    res.json(users);
   } catch (err) {
    console.error('Error fetching booked users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
