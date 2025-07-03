const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  phone: {
    type: String,
  },

  profileImage: {
    type: String,
  },

  
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);