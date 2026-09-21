const VisionSession = require('../models/VisionSession');

async function create(userId, data) {
  return VisionSession.create({ ...data, userId });
}

async function analytics(userId, days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const sessions = await VisionSession.find({ userId, createdAt: { $gte: since } }).sort({ createdAt: -1 });
  return {
    days,
    totalSeconds: sessions.reduce((total, session) => total + session.durationSeconds, 0),
    sessions: sessions.map((session) => session.toJSON())
  };
}

module.exports = { create, analytics };
