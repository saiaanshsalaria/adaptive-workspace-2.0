const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
  emailVerified: { type: Boolean, default: true },
  verificationCodeHash: { type: String, select: false, default: null },
  verificationCodeExpiresAt: { type: Date, select: false, default: null }
  ,
  resetCodeHash: { type: String, select: false, default: null },
  resetCodeExpiresAt: { type: Date, select: false, default: null }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('User', userSchema);
