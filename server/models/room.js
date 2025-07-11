const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  resortId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resort",
    required: true,
  },
  roomName: { type: String, required: true },
  roomPrice: { type: Number, required: true },
  roomDescription: { type: String, required: true },
  roomImages: { type: [String], required: true }, 
});

module.exports = mongoose.model("Room", roomSchema);
