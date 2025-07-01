// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

const UserSchema = new mongoose.Schema({
  name: { // Assuming 'name' from your authRoutes.js
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { // Match the field name used in your authRoutes.js
    type: String,
    required: false, // Make it optional for Google users if not set
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user',
  },
  isGoogleUser: { // Added for Google login differentiation
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

// Mongoose pre-save hook to hash password before saving (only for non-Google users or if passwordHash is modified)
UserSchema.pre('save', async function(next) {
  // Only hash password if it's a new user AND not a Google user OR if passwordHash is being modified
  if (!this.isModified('passwordHash') || this.isGoogleUser) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare entered password with hashed password during login (for non-Google users)
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isGoogleUser) {
    return false; // Google users don't have a stored password to match
  }
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// IMPORTANT: Your authRoutes.js is `require`ing `../models/users`.
// So ensure this file is saved as `server/models/users.js` (plural)
module.exports = mongoose.model('User', UserSchema);