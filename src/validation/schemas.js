const { z } = require('zod');

const id = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
const paramsId = z.object({ id });
const register = z.object({ name: z.string().trim().min(1).max(100), email: z.string().email(), password: z.string().min(8).max(128) });
const login = z.object({ email: z.string().email(), password: z.string().min(1) });
const verifyEmail = z.object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/, 'Verification code must be 6 digits') }).strict();
const forgotPassword = z.object({ email: z.string().email() }).strict();
const resetPassword = z.object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/), password: z.string().min(8).max(128) }).strict();
const profile = z.object({ name: z.string().trim().min(1).max(100).optional(), email: z.string().email().optional() }).strict();
const preferences = z.object({
  environment: z.record(z.any()).optional(),
  automations: z.array(z.record(z.any())).optional()
}).strict();
const project = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string().max(2000).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  deadline: z.coerce.date().nullable().optional(),
  progress: z.number().min(0).max(100).optional()
}).strict();
const task = z.object({
  projectId: id.nullable().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['todo', 'in_progress', 'blocked', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  deadline: z.coerce.date().nullable().optional(),
  estimatedDuration: z.number().min(0).optional(),
  actualDuration: z.number().min(0).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional()
}).strict();
const taskUpdate = task.partial();
const filters = z.object({
  projectId: id.optional(),
  status: z.enum(['todo', 'in_progress', 'blocked', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  deadline: z.coerce.date().optional()
});
const documentUpload = z.object({
  projectId: id.optional().or(z.literal('')).transform((value) => value || undefined)
}).strict();
const chat = z.object({
  message: z.string().trim().min(1).max(4000)
}).strict();
const focusSession = z.object({
  durationSeconds: z.number().int().min(1).max(24 * 60 * 60),
  completed: z.boolean().optional(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date()
}).strict();
const visionSession = z.object({
  durationSeconds: z.number().int().min(1).max(24 * 60 * 60),
  sampleCount: z.number().int().min(1).max(100000),
  averageLighting: z.number().min(0).max(100).optional(),
  averagePosture: z.number().min(0).max(100).optional(),
  lowConfidenceSeconds: z.number().min(0).max(24 * 60 * 60).default(0),
  breakSuggested: z.boolean().default(false),
  modelVersion: z.string().trim().min(1).max(64)
}).strict();
const analyticsQuery = z.object({
  days: z.coerce.number().int().min(1).max(31).default(7)
});

module.exports = { id, paramsId, register, login, verifyEmail, forgotPassword, resetPassword, profile, preferences, project, task, taskUpdate, filters, documentUpload, chat, focusSession, visionSession, analyticsQuery };
