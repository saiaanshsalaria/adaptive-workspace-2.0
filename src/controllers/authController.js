const service = require('../services/authService');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { revokeToken } = require('../utils/jwt');
const cookieOptions = { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' };

exports.register = asyncHandler(async (req, res) => {
  const result = await service.register(req.body);
  return success(res, result, 201);
});
exports.login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  res.cookie('adaptive_workspace_token', result.token, cookieOptions);
  return success(res, result);
});
exports.verifyEmail = asyncHandler(async (req, res) => {
  const result = await service.verifyEmail(req.body);
  res.cookie('adaptive_workspace_token', result.token, cookieOptions);
  return success(res, result);
});
exports.resendVerification = asyncHandler(async (req, res) => success(res, await service.resendVerification(req.body)));
exports.requestPasswordReset = asyncHandler(async (req, res) => success(res, await service.requestPasswordReset(req.body)));
exports.resetPassword = asyncHandler(async (req, res) => success(res, await service.resetPassword(req.body)));
exports.me = asyncHandler(async (req, res) => success(res, req.user));
exports.updateMe = asyncHandler(async (req, res) => success(res, await service.updateProfile(req.user.id, req.body)));
exports.getPreferences = asyncHandler(async (req, res) => success(res, await service.getPreferences(req.user.id)));
exports.updatePreferences = asyncHandler(async (req, res) => success(res, await service.updatePreferences(req.user.id, req.body)));
exports.deleteAccount = asyncHandler(async (req, res) => {
  revokeToken(req.auth.payload);
  const result = await service.deleteAccount(req.user.id);
  res.clearCookie('adaptive_workspace_token', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return success(res, result);
});
exports.logout = asyncHandler(async (req, res) => {
  revokeToken(req.auth.payload);
  res.clearCookie('adaptive_workspace_token', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return success(res, { loggedOut: true });
});
