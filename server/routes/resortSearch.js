const express       = require('express');
const Resort        = require('../models/resort');
const Reservation = require('../models/reservation');

const router = express.Router();


router.get('/search', async (req, res) => {
  try {
    const {
      location,
      checkIn,     
      checkOut,    
      maxPrice,
      petFriendly,
      sort,

      type,
      rooms,
      adults,
      children,
    } = req.query;


    const q = { status: 'approved' };

    // Location filter
    if (location)
      q.location = new RegExp(location, 'i');

    // Type filter
    if (type)
      q.type = new RegExp(`^${type}$`, 'i');

    // Max Price filter
    if (maxPrice)
      q.price = { $lte: Number(maxPrice) };

    // Rooms filter (number of rooms the resort has available, should be >= requested rooms)
    // Note: If you have a dynamic 'availableRooms' field, use that. Assuming 'rooms' on Resort is total rooms.
    // If you need to filter by 'available rooms for a given date', that's more complex and involves reservation logic.
    // For now, it filters by the total rooms available in the resort being greater than or equal to requested.
   if (rooms && Number(rooms) > 0)
  q.rooms = { $gte: Number(rooms) };

  if (adults && Number(adults) > 0)
  q.maxAdults = { $gte: Number(adults) };

     if (children && Number(children) > 0)
  q.maxChildren = { $gte: Number(children) };

    // Pet-friendly filter
    if (petFriendly === '1') {
      q.amenities = { $regex: /pet[- ]?friendly/i };
    }

    
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find reservations that overlap with the requested checkIn and checkOut dates
      const unavailableResortIds = await Reservation
        .find({
          $or: [
            // Case 1: Existing reservation starts during the requested period
            { checkIn: { $gte: checkInDate, $lt: checkOutDate } },
            // Case 2: Existing reservation ends during the requested period
            { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
            // Case 3: Existing reservation fully encompasses the requested period
            { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } },
          ]
        })
        .distinct('resortId'); // Get unique resort IDs from these overlapping reservations

      q._id = { $nin: unavailableResortIds }; // Exclude resorts with overlapping reservations
    }

 
    const sortOpt =
      sort === 'low-to-high'
        ? { price: 1 }
        : sort === 'high-to-low'
        ? { price: -1 }
        : {};

 
    const resorts = await Resort.find(q).sort(sortOpt);
    res.json(resorts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;