const mongoose = require("mongoose");

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  amenities: { type: [String], default: [] },
  type: {
    type: String,
    enum: ['Beach', 'Mountain', 'Desert', 'City', 'Island', 'Adventure', 'Wellness', 'Other'],
    required: true,
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  visible: {
    type: Boolean,
    default: true, // true = visible to users, false = hidden
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt on save
resortSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Resort", resortSchema);
