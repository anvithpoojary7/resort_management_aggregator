const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  phone: {
    type: String,
  },

  department: {
    type: String,
  },

  // Add any other admin-specific fields here
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);