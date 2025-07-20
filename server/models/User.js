const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
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
  passwordHash: {
    type: String,
    required: false,
  },
 role: { 
    type: String,
    default: 'user',
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash') || this.isGoogleUser) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isGoogleUser) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// ✅ Prevent model overwrite error during hot-reload/dev
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
