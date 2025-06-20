const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resort' },
  startDate: Date,
  endDate: Date,
  guests: Number,
  status: { type: String, enum: ['confirmed', 'cancelled', 'modified'], default: 'confirmed' }
});

module.exports = mongoose.model('Booking', bookingSchema);
