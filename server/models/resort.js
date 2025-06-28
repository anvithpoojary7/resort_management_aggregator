const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
  name: String,
  location: String,
  pricePerNight: Number,
  availableDates: [Date],
  amenities: [String],
  images: [
    {
      data: Buffer,
      contentType: String,
    }
  ],
  description: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Resort', resortSchema);
