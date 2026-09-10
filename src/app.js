const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const documentRoutes = require('./routes/documentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const focusRoutes = require('./routes/focusRoutes');
const { requireAuth } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { success } = require('./utils/apiResponse');

const app = express();
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.cookie = (name, value, options) => {
    const attributes = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || '/'}`, `Max-Age=${Math.floor((options.maxAge || 0) / 1000)}`, 'HttpOnly', `SameSite=${options.sameSite || 'Lax'}`];
    if (options.secure) attributes.push('Secure');
    res.append('Set-Cookie', attributes.join('; '));
  };
  res.clearCookie = (name, options) => res.append('Set-Cookie', `${name}=; Path=${options.path || '/'}; Max-Age=0; HttpOnly; SameSite=${options.sameSite || 'Lax'}${options.secure ? '; Secure' : ''}`);
  next();
});
app.use(helmet());
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/health', (req, res) => success(res, { status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', requireAuth, projectRoutes);
app.use('/api/tasks', requireAuth, taskRoutes);
app.use('/api/documents', requireAuth, documentRoutes);
app.use('/api/ai', requireAuth, aiRoutes);
app.use('/api/focus', requireAuth, focusRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
