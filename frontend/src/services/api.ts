import { TaskItem } from '../types';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
export const TOKEN_KEY = 'adaptive_workspace_token';
export const USER_KEY = 'adaptive_workspace_user';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiDocument {
  id: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md';
  size: number;
  extractedText: string;
  uploadDate: string;
  processingStatus: 'uploaded' | 'processing' | 'completed' | 'failed';
  projectId?: string | null;
}

export interface ApiChatResponse {
  message: string;
  sources?: Array<string | { title?: string; name?: string; filename?: string }>;
  suggestions?: string[];
  actions?: string[] | Array<{ label?: string; title?: string; name?: string }>;
}

export interface FocusAnalytics {
  days: number;
  totalSeconds: number;
  completedSessions: number;
  daily: Array<{ date: string; seconds: number }>;
}

export interface VisionSessionSummary {
  durationSeconds: number;
  sampleCount: number;
  averageLighting?: number;
  averagePosture?: number;
  lowConfidenceSeconds?: number;
  breakSuggested?: boolean;
  modelVersion: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { message?: string };
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!response.ok || body.success === false) {
    throw new ApiError(body.error?.message || 'The API request failed.', response.status);
  }
  return body.data;
}

export const api = {
  me: () => request<ApiUser>('/api/auth/me'),
  login: (email: string, password: string) =>
    request<{ user: ApiUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: (name: string, email: string, password: string) =>
    request<{ verificationRequired: boolean; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),
  verifyEmail: (email: string, code: string) =>
    request<{ user: ApiUser; token: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    }),
  resendVerification: (email: string) => request<{ sent: boolean }>('/api/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  forgotPassword: (email: string) => request<{ sent: boolean }>('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (email: string, code: string, password: string) =>
    request<{ reset: boolean }>('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, password }) }),
  updateProfile: (data: { name?: string; email?: string }) =>
    request<ApiUser>('/api/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
  listTasks: () => request<unknown[]>('/api/tasks'),
  createTask: (task: Omit<TaskItem, 'id' | 'completed'>) =>
    request<unknown>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.title,
        description: task.note,
        status: task.status,
        priority: task.priority.toLowerCase(),
        estimatedDuration: (task.estimatedBlocks || 1) * 25
      })
    }),
  updateTask: (id: string, completed: boolean) =>
    request<unknown>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: completed ? 'completed' : 'in_progress' })
    }),
  deleteTask: (id: string) => request<unknown>(`/api/tasks/${id}`, { method: 'DELETE' }),
  listDocuments: () => request<ApiDocument[]>('/api/documents'),
  chat: (message: string, projectId?: string) =>
    request<ApiChatResponse>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, ...(projectId ? { projectId } : {}) })
    }),
  uploadDocument: (file: File, projectId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);
    return request<ApiDocument>('/api/documents', { method: 'POST', body: formData });
  },
  deleteDocument: (id: string) => request<null>(`/api/documents/${id}`, { method: 'DELETE' })
  ,
  getPreferences: () => request<{ environment?: unknown; automations?: unknown[] }>('/api/auth/preferences'),
  updatePreferences: (preferences: { environment?: unknown; automations?: unknown[] }) =>
    request<{ environment?: unknown; automations?: unknown[] }>('/api/auth/preferences', { method: 'PATCH', body: JSON.stringify(preferences) }),
  deleteAccount: () => request<{ deleted: boolean }>('/api/auth/me', { method: 'DELETE' }),
  createFocusSession: (session: { durationSeconds: number; completed: boolean; startedAt: string; endedAt: string }) =>
    request<unknown>('/api/focus/sessions', { method: 'POST', body: JSON.stringify(session) }),
  getFocusAnalytics: () => request<FocusAnalytics>('/api/focus/analytics?days=7'),
  createVisionSession: (session: VisionSessionSummary) =>
    request<unknown>('/api/vision/sessions', { method: 'POST', body: JSON.stringify(session) }),
  getVisionAnalytics: () => request<{ days: number; totalSeconds: number; sessions: VisionSessionSummary[] }>('/api/vision/analytics?days=7')
};

export function normalizeTask(value: any): TaskItem {
  const status = value.status === 'completed' || value.status === 'in_progress' ? value.status : 'todo';
  return {
    id: String(value._id || value.id),
    title: value.title,
    note: value.description || 'Synced from workspace API',
    project: value.project?.name || 'General Directives',
    priority: value.priority ? `${value.priority[0].toUpperCase()}${value.priority.slice(1)}` as TaskItem['priority'] : 'Medium',
    status,
    completed: status === 'completed',
    estimatedBlocks: value.estimatedDuration ? Math.max(1, Math.round(value.estimatedDuration / 25)) : undefined
  };
}

export function normalizeDocument(value: ApiDocument): import('../types').IndexedDocument {
  const type = value.fileType === 'md' ? 'markdown' : value.fileType === 'pdf' ? 'pdf' : 'text';
  const extractedText = value.extractedText || '';
  return {
    id: String(value.id),
    title: value.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
    filename: value.filename,
    size: value.size >= 1024 * 1024
      ? `${(value.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(value.size / 1024).toFixed(1)} KB`,
    tokenCount: extractedText ? Math.max(1, Math.ceil(extractedText.length / 4)) : 0,
    indexedAt: value.uploadDate ? new Date(value.uploadDate).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Just now',
    status: value.processingStatus === 'completed' ? 'Indexed' : 'Processing',
    type,
    tags: ['Workspace', 'Context', 'Directives'],
    preview: extractedText || `${value.filename} is being processed by the workspace index.`
  };
}
