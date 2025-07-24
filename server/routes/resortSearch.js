const express       = require('express');
const Resort        = require('../models/resort');
const Reservation = require('../models/reservation');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const {
      location,
      checkIn,     
      checkOut,    
      maxPrice,
      sort,
      type,
      rooms,
      adults,
      children,
      amenities, // <-- Added this to get amenities from the query
    } = req.query;

    const q = { status: 'approved' };

    // Location filter
    if (location) {
      q.location = new RegExp(location, 'i');
    }

    // Type filter
    if (type) {
      q.type = new RegExp(`^${type}$`, 'i');
    }

    // Max Price filter
    if (maxPrice) {
      q.price = { $lte: Number(maxPrice) };
    }

    // Capacity filters
    if (rooms && Number(rooms) > 0) {
      q.rooms = { $gte: Number(rooms) };
    }
    if (adults && Number(adults) > 0) {
      q.maxAdults = { $gte: Number(adults) };
    }
    if (children && Number(children) >= 0) { // Allow for 0 children
      q.maxChildren = { $gte: Number(children) };
    }

    // --- NEW: General Amenities Filter ---
    // This finds resorts that have ALL the specified amenities.
    if (amenities && amenities.length > 0) {
      // Ensure amenities is an array, even if only one is passed
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      
      // Create case-insensitive regex for each amenity
      const regexAmenities = amenitiesArray.map(a => new RegExp(a, 'i'));

      q.amenities = { $all: regexAmenities };
    }

    // Date Availability Filter
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find reservations that conflict with the requested dates
      const unavailableResortIds = await Reservation
        .find({
          $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
          ]
        }, 'resortId') // More efficient to only select the resortId field
        .distinct('resortId');

      q._id = { $nin: unavailableResortIds }; // Exclude resorts that are unavailable
    }

    // Sorting options
    const sortOpt =
      sort === 'low-to-high' ? { price: 1 }
      : sort === 'high-to-low' ? { price: -1 }
      : { createdAt: -1 }; // Default sort by newest

    const resorts = await Resort.find(q).sort(sortOpt);
    res.json(resorts);

  } catch (err) {
    console.error('Error searching resorts:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;