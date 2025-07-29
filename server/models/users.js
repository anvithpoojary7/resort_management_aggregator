const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: false, // For Google users, it can be empty
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
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
    },

    // ✅ Wishlist field added
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resort',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || this.isGoogleUser) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.isGoogleUser) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
