const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    resort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resort',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Prevents multiple reviews for the same booking
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer'
      }
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

// Optional: Ensure a user can only review a given resort once per booking
reviewSchema.index({ booking: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
