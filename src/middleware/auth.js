const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { failure } = require('../utils/apiResponse');

async function requireAuth(req, res, next) {
  const header = req.get('authorization');
  const cookieToken = (req.get('cookie') || '').match(/(?:^|;\s*)adaptive_workspace_token=([^;]+)/)?.[1];
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : cookieToken;
  if (!token) {
    return failure(res, 401, 'Authentication required', undefined, 'AUTH_REQUIRED');
  }
  try {
    const payload = verifyToken(token);
    req.auth = { token, payload };
    req.user = await User.findById(payload.sub).select('-passwordHash');
    if (!req.user) return failure(res, 401, 'Invalid token', undefined, 'INVALID_TOKEN');
    return next();
  } catch {
    return failure(res, 401, 'Invalid or expired token', undefined, 'INVALID_TOKEN');
  }
}

module.exports = { requireAuth };
