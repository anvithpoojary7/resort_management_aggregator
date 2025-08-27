

const express = require('express');
const router = express.Router();
const Resort = require('../models/resort');
const Booking=require('../models/booking')
router.get('/', async (req, res) => {
    try {
    const resorts = await Resort.find().populate("ownerId", "name");

    
    const resortIds = resorts.map((r) => r._id);

    const revenueData = await Booking.aggregate([
      {
        $match: {
          resort: { $in: resortIds },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: "$resort",
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    
    const revenueMap = {};
    revenueData.forEach((r) => {
      revenueMap[r._id.toString()] = {
        revenue: r.totalRevenue,
        bookings: r.totalBookings,
      };
    });

    const resortsWithRevenue = resorts.map((resort) => ({
      ...resort.toObject(),
      revenue: revenueMap[resort._id.toString()]?.revenue || 0,
      bookings: revenueMap[resort._id.toString()]?.bookings || 0,
    }));

    res.json(resortsWithRevenue);
  } catch (error) {
    console.error("Error fetching resorts:", error);
    res.status(500).json({ error: "Failed to fetch resorts" });
  }
});

router.patch('/visibility/:resortId', async (req, res) => {
  const { resortId } = req.params;
  const { isVisible } = req.body;

  try {
    const updatedResort = await Resort.findByIdAndUpdate(
      resortId,
      { isVisible },
      { new: true }
    );

    if (!updatedResort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    res.status(200).json({ message: 'Visibility updated', resort: updatedResort });
  } catch (err) {
    console.error('Error updating visibility:', err);
    res.status(500).json({ message: 'Server error while updating visibility' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const { name, location, price } = req.body;


    if (!name || !location || price === undefined) {
      return res.status(400).json({ message: "Missing required fields: name, location, price" });
    }

    const updatedResort = await Resort.findByIdAndUpdate(
      id,
      { $set: { name, location, price } },
      { new: true }
    );

    if (!updatedResort) {
      return res.status(404).json({ message: "Resort not found" });
    }
    
    res.status(200).json({ message: "Resort updated successfully ✅", resort: updatedResort });

  } catch (error) {
    console.error("Error updating resort:", error);
    res.status(500).json({ message: "Failed to update resort ❌" });
  }
});

module.exports=router;