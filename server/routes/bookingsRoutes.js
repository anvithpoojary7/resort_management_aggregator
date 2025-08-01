const express=require('express');
const router=express.Router();
const Booking = require('../models/booking');
const authMiddleware = require('../middleware/auth');

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('resort', 'name images')   
      .populate('room', 'roomName roomImages roomPrice'); 
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});


router.post("/", async (req, res) => {
    
  try {
    console.log("📥 Booking request received:", req.body);
    const {
      user,
      resort,
      room,
      checkIn,
      checkOut,
      totalAmount,
      paymentStatus,
      paymentId
    } = req.body;
   
    const booking = await Booking.create({
      user,
      resort,
      room,
      checkIn,
      checkOut,
      totalAmount,
      paymentStatus,
      paymentId
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

module.exports=router;
