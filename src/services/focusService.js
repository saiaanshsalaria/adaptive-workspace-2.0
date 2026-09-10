const FocusSession = require('../models/FocusSession');

async function create(userId, data) {
  return FocusSession.create({ ...data, userId });
}

async function analytics(userId, days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const sessions = await FocusSession.find({ userId, startedAt: { $gte: since } }).sort({ startedAt: 1 });
  const totals = sessions.reduce((result, session) => {
    const day = session.startedAt.toISOString().slice(0, 10);
    result[day] = (result[day] || 0) + session.durationSeconds;
    return result;
  }, {});
  return {
    days,
    totalSeconds: sessions.reduce((total, session) => total + session.durationSeconds, 0),
    completedSessions: sessions.filter((session) => session.completed).length,
    sessions: sessions.map((session) => session.toJSON()),
    daily: Object.entries(totals).map(([date, seconds]) => ({ date, seconds }))
  };
}

module.exports = { create, analytics };
