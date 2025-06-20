const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
});

module.exports = mongoose.model('User', userSchema);
