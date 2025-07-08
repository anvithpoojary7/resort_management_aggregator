const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  resortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resort', required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  checkIn:  { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests:   { type: Number, default: 1 },
  rooms:    { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
