const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');
const revokedTokens = new Map();

function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN, jwtid: crypto.randomUUID() });
}

function verifyToken(token) {
  purgeRevokedTokens();
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.jti && revokedTokens.has(payload.jti)) {
    const error = new Error('Token has been revoked');
    error.name = 'RevokedTokenError';
    throw error;
  }
  return payload;
}

function revokeToken(payload) {
  if (!payload.jti) return;
  revokedTokens.set(payload.jti, payload.exp ? payload.exp * 1000 : Date.now() + 86400000);
}

function purgeRevokedTokens() {
  const now = Date.now();
  for (const [jti, expiresAt] of revokedTokens) if (expiresAt <= now) revokedTokens.delete(jti);
}

module.exports = { signToken, verifyToken, revokeToken, purgeRevokedTokens };
