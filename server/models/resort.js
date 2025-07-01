const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: {
    type: String, // This will store the GridFS filename for the image
    required: true,
  },
  description: { type: String, required: true },
  amenities: { type: [String], default: [] },
  type: {
    type: String,
    required: true,
    enum: ['Beach', 'Mountain', 'Desert', 'City', 'Island', 'Adventure', 'Wellness', 'Other'],
  },
  ownerId: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` field on every save
resortSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resort', resortSchema);