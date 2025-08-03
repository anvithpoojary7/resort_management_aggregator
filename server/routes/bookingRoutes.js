const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const User = require('../models/users');
const Resort = require('../models/resort');
const Room = require('../models/room');
const authMiddleware = require('../middleware/auth');
const Reservation = require('../models/reservation');
const { sendBookingConfirmation } = require('../utils/email');

router.get('/my', authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Fetching bookings for user:", req.user._id);

    const bookings = await Booking.find({ user: req.user._id })
      .populate('resort', 'name images')
      .populate('room', 'roomName roomImages roomPrice');

    console.log("✅ Bookings fetched:", bookings.length);
    res.status(200).json({ success: true, bookings });

  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("🛎️ Booking request received:", req.body);

    const {
      resort,
      room,
      checkIn,
      checkOut,
      totalAmount,
      guestsAdult,
      guestsChild,
      paymentStatus,
      paymentId,
    } = req.body;

    const userId = req.user.id;

   const overlappingBooking = await Booking.findOne({
  user: userId,
  room, 
  $or: [
    { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
  ]
});

if (overlappingBooking) {
  const existingCheckIn = new Date(overlappingBooking.checkIn).toLocaleDateString("en-GB");
  const existingCheckOut = new Date(overlappingBooking.checkOut).toLocaleDateString("en-GB");

  return res.status(409).json({
    error: `You’ve already booked this room from ${existingCheckIn} to ${existingCheckOut}. Please select other dates.`,
  });
}


    const newBooking = new Booking({
      user: userId,
      resort,
      room,
      checkIn,
      checkOut,
      totalAmount,
      guestsAdult,
      guestsChild,
      paymentStatus,
      paymentId,
    });

    await newBooking.save();
    console.log("✅ Booking saved:", newBooking._id);

    const newReservation = new Reservation({
      userId: userId,
      resortId: resort,
      roomId: room,
      checkIn,
      checkOut,
      status: paymentStatus === "paid" ? "confirmed" : "pending",
    });

    await newReservation.save();
    console.log("✅ Reservation saved");

    const [user, resortDoc, roomDoc] = await Promise.all([
      User.findById(userId),
      Resort.findById(resort),
      Room.findById(room),
    ]);

    if (!user || !resortDoc || !roomDoc) {
      console.error("❌ Missing user/resort/room document:", { user, resortDoc, roomDoc });
      return res.status(500).json({ error: "Something went wrong fetching booking details." });
    }

    await sendBookingConfirmation(
      user.email,
      user.name,
      {
        resortName: resortDoc.name,
        roomName: roomDoc.roomName,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: guestsAdult,
        children: guestsChild,
        totalPrice: totalAmount,
      }
    );

    console.log("✅ Booking confirmation email sent.");
    res.status(201).json({ success: true, message: "Booking successful", booking: newBooking });

  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

module.exports = router;

