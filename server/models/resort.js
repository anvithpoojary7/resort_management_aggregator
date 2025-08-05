const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, trim: true },
  roomPrice: { type: Number, required: true, min: 0 },
  roomDescription: { type: String, required: true },
  roomImages: { type: [String], default: [] },
  amenities: { type: [String], default: [] } // amenities inside each room
});

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['Beach', 'Mountain', 'Desert', 'City', 'Island', 'Adventure', 'Wellness', 'Other'],
    required: true,
  },
  rooms: { type: [roomSchema], default: [] }, // embed rooms here
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

resortSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Resort", resortSchema);
