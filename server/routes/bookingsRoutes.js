const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const User = require('../models/users');
const Resort = require('../models/resort');
const Room = require('../models/room');
const authMiddleware = require('../middleware/auth');
const Reservation = require('../models/reservation');
// const { sendBookingConfirmation } = require('../utils/email'); 

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

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const {
      user,
      resort,
      room,
      checkIn,
      checkOut,
      totalAmount,
      paymentStatus,
      paymentId,
      guestsAdult,
      guestsChild
    } = req.body;

    const overlapping = await Reservation.findOne({
      roomId: room,
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
      ]
    });

    if (overlapping) {
      return res.status(409).json({ success: false, message: "This room is already reserved for those dates" });
    }

    const booking = await Booking.create({
      user,
      resort,
      room,
      checkIn,
      checkOut,
      totalAmount,
      paymentStatus,
      paymentId,
      guestsAdult,
      guestsChild
    });

    const adultCount = Number(guestsAdult) || 0;
    const childCount = Number(guestsChild) || 0;
    const totalGuests = adultCount + childCount;

    await Reservation.create({
      resortId: resort,
      roomId: room,
      userId: user,
      checkIn,
      checkOut,
      guests: totalGuests,
      sourceBookingId: booking._id
    });

    console.log("✅ Booking saved:", booking);

    // const userData = await User.findById(user);
    // const resortData = await Resort.findById(resort);
    // const roomData = await Room.findById(room);

    // await sendBookingConfirmation(
    //   userData.email,
    //   userData.name,
    //   {
    //     resortName: resortData.name,
    //     roomName: roomData.roomName,
    //     checkInDate: booking.checkIn,
    //     checkOutDate: booking.checkOut,
    //     adults: guestsAdult || 0,
    //     children: guestsChild || 0,
    //     totalPrice: booking.totalAmount
    //   }
    // );
    // console.log("✅ Booking confirmation email triggered.");

    res.status(201).json({
      success: true,
      message: "Booking successful!",
      booking: booking,
    });

  } catch (err) {
    console.error("Booking error:", err.message);
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

module.exports = router;
