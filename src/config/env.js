const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/adaptive-ai-workspace'),
  JWT_SECRET: z.string().min(16).default('development-only-change-me-please'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  DOCUMENT_MAX_SIZE: z.coerce.number().int().positive().default(10 * 1024 * 1024),
  AI_API_KEY: z.preprocess((value) => value || undefined, z.string().optional()),
  AI_API_URL: z.preprocess((value) => value || undefined, z.string().url().optional())
  ,
  SMTP_HOST: z.preprocess((value) => value || undefined, z.string().optional()),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.preprocess((value) => value || undefined, z.string().optional()),
  SMTP_PASSWORD: z.preprocess((value) => value || undefined, z.string().optional()),
  EMAIL_FROM: z.string().default('Adaptive Workspace <no-reply@example.com>')
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}
if (parsed.data.NODE_ENV === 'production' && parsed.data.CLIENT_ORIGIN.includes('*')) {
  throw new Error('CLIENT_ORIGIN must list explicit HTTPS origins in production');
}
if (parsed.data.NODE_ENV === 'production' && parsed.data.JWT_SECRET === 'development-only-change-me-please') {
  throw new Error('JWT_SECRET must be replaced in production');
}

module.exports = parsed.data;
