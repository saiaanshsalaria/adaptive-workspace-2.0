const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Document = require('../models/Document');
const FocusSession = require('../models/FocusSession');
const { signToken } = require('../utils/jwt');
const crypto = require('crypto');
const { sendVerificationCode } = require('./emailService');

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

async function register(data) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const code = crypto.randomInt(100000, 1000000).toString();
  const existingUser = await User.findOne({ email: data.email }).select('+verificationCodeHash +verificationCodeExpiresAt');
  if (existingUser?.emailVerified) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    error.code = 'RESOURCE_EXISTS';
    throw error;
  }

  const user = existingUser || new User({ email: data.email });
  user.name = data.name;
  user.passwordHash = passwordHash;
  user.emailVerified = false;
  user.verificationCodeHash = hashCode(code);
  user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendVerificationCode(user.email, code);
  return { verificationRequired: true, email: user.email };
}

async function login(data) {
  const user = await User.findOne({ email: data.email }).select('+passwordHash +verificationCodeHash +verificationCodeExpiresAt');
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    const error = new Error('Invalid email or password'); error.statusCode = 401; error.code = 'INVALID_CREDENTIALS'; throw error;
  }
  if (!user.emailVerified) {
    const error = new Error('Verify your email before signing in'); error.statusCode = 403; error.code = 'EMAIL_NOT_VERIFIED'; throw error;
  }
  return { user: { id: user.id, name: user.name, email: user.email }, token: signToken(user.id) };
}

async function verifyEmail(data) {
  const user = await User.findOne({ email: data.email }).select('+verificationCodeHash +verificationCodeExpiresAt');
  if (!user || user.emailVerified || !user.verificationCodeHash || !user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date() || !crypto.timingSafeEqual(Buffer.from(hashCode(data.code)), Buffer.from(user.verificationCodeHash))) {
    const error = new Error('Invalid or expired verification code'); error.statusCode = 400; error.code = 'INVALID_VERIFICATION_CODE'; throw error;
  }

  user.emailVerified = true;
  user.verificationCodeHash = null;
  user.verificationCodeExpiresAt = null;
  await user.save();
  return { user: { id: user.id, name: user.name, email: user.email }, token: signToken(user.id) };
}

async function resendVerification(data) {
  const user = await User.findOne({ email: data.email }).select('+verificationCodeHash +verificationCodeExpiresAt');
  if (!user || user.emailVerified) return { sent: true };
  const code = crypto.randomInt(100000, 1000000).toString();
  user.verificationCodeHash = hashCode(code);
  user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendVerificationCode(user.email, code);
  return { sent: true };
}

async function requestPasswordReset(data) {
  const user = await User.findOne({ email: data.email }).select('+resetCodeHash +resetCodeExpiresAt');
  if (!user) return { sent: true };
  const code = crypto.randomInt(100000, 1000000).toString();
  user.resetCodeHash = hashCode(code);
  user.resetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendVerificationCode(user.email, code);
  return { sent: true };
}

async function resetPassword(data) {
  const user = await User.findOne({ email: data.email }).select('+resetCodeHash +resetCodeExpiresAt');
  if (!user || !user.resetCodeHash || !user.resetCodeExpiresAt || user.resetCodeExpiresAt < new Date() || !crypto.timingSafeEqual(Buffer.from(hashCode(data.code)), Buffer.from(user.resetCodeHash))) {
    const error = new Error('Invalid or expired reset code'); error.statusCode = 400; error.code = 'INVALID_RESET_CODE'; throw error;
  }
  user.passwordHash = await bcrypt.hash(data.password, 12);
  user.resetCodeHash = null;
  user.resetCodeExpiresAt = null;
  await user.save();
  return { reset: true };
}

async function updateProfile(userId, data) {
  return User.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).select('-passwordHash');
}

async function getPreferences(userId) {
  const user = await User.findById(userId).select('preferences');
  return user?.preferences || {};
}

async function updatePreferences(userId, preferences) {
  const user = await User.findByIdAndUpdate(userId, { preferences }, { new: true, runValidators: true }).select('preferences');
  return user.preferences || {};
}

async function deleteAccount(userId) {
  await Promise.all([
    Project.deleteMany({ userId }),
    Task.deleteMany({ userId }),
    Document.deleteMany({ userId }),
    FocusSession.deleteMany({ userId })
  ]);
  await User.findByIdAndDelete(userId);
  return { deleted: true };
}

module.exports = { register, login, verifyEmail, resendVerification, requestPasswordReset, resetPassword, updateProfile, getPreferences, updatePreferences, deleteAccount };
