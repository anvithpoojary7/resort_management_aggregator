const express      = require('express');
const Resort       = require('../models/resort');
const Reservation  = require('../models/reservation');
const router = express.Router();


router.get('/search', async (req, res) => {
  try {
    const {
      location, checkIn, checkOut,
      maxPrice, petFriendly, sort
    } = req.query;

    const q = { status: 'approved' };

    if (location)
      q.location = new RegExp(location, 'i');

    if (maxPrice)
      q.price = { $lte: Number(maxPrice) };

    if (petFriendly === '1')
      q.amenities = { $in: ['Pet‑Friendly'] }; 

   
    if (checkIn && checkOut) {
      const unavailable = await Reservation
        .find({
          checkIn : { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn)  }
        })
        .distinct('resortId');
      q._id = { $nin: unavailable };
    }

    const sortOpt = sort === 'low-to-high'
      ? { price: 1 }
      : sort === 'high-to-low'
      ? { price: -1 } : {};

    const resorts = await Resort.find(q).sort(sortOpt);
    res.json(resorts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
