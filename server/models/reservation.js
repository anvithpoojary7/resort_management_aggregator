const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  resortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resort', required: true },
  roomId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Room',   required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  checkIn:  { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests:   { type: Number, default: 1 },
  sourceBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, 
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
