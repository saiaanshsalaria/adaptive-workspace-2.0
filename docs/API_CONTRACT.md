# Adaptive AI Workspace API Contract

This contract is the integration boundary between the frontend and backend. Protected
endpoints require `Authorization: Bearer <token>`.

## Response envelope

Successful responses use:

```json
{ "success": true, "data": {} }
```

Errors use:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project not found"
  }
}
```

## Authentication

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `{ "name": "User", "email": "user@example.com", "password": "..." }` | `{ "user": {}, "token": "..." }` |
| POST | `/api/auth/login` | `{ "email": "user@example.com", "password": "..." }` | `{ "user": {}, "token": "..." }` |
| GET | `/api/auth/me` | - | `{ "user": {} }` |
| PATCH | `/api/auth/me` | Profile fields | `{ "user": {} }` |
| POST | `/api/auth/logout` | - | `null` |

Passwords and password hashes are never returned.

## Projects

| Method | Endpoint | Request |
| --- | --- | --- |
| GET | `/api/projects` | Optional `status`, `priority`, `search` query parameters |
| POST | `/api/projects` | `{ "name": "...", "description": "...", "status": "active", "priority": "high", "deadline": "YYYY-MM-DD" }` |
| GET | `/api/projects/:id` | - |
| PUT | `/api/projects/:id` | Any editable project fields |
| DELETE | `/api/projects/:id` | - |

## Tasks

| Method | Endpoint | Request |
| --- | --- | --- |
| GET | `/api/tasks` | Optional `projectId`, `status`, `priority`, `deadline` query parameters |
| POST | `/api/tasks` | `{ "projectId": "optional-id", "title": "...", "description": "...", "status": "todo", "priority": "high" }` |
| GET | `/api/tasks/:id` | - |
| PUT | `/api/tasks/:id` | Any editable task fields |
| DELETE | `/api/tasks/:id` | - |

## Documents

Documents are uploaded as `multipart/form-data` with a required `file` field and
an optional `projectId` field. PDF, DOCX, TXT, and Markdown files are supported
(maximum size is `DOCUMENT_MAX_SIZE`, default 10 MiB).

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| POST | `/api/documents` | Multipart `file`, optional `projectId` | Created document with extracted text |
| GET | `/api/documents` | - | User's documents, newest first |
| GET | `/api/documents/:id` | - | Document |
| DELETE | `/api/documents/:id` | - | `null` |

Documents expose `filename`, `fileType`, `size`, `extractedText`, `uploadDate`,
and `processingStatus` (`uploaded`, `processing`, `completed`, or `failed`).

## AI chat

`POST /api/ai/chat` is authenticated and accepts `{ "message": "..." }`. The
response is wrapped in the standard envelope and has this shape:

```json
{
  "message": "Based on your workspace context: ...",
  "sources": [{ "type": "document", "id": "...", "title": "notes.txt", "snippet": "...", "relevance": 2 }],
  "suggestions": ["Ask about a specific document or task"],
  "actions": []
}
```

Retrieval is scoped to the user and includes document text plus pending tasks and
active projects. When no relevant context exists, `message` says the information is
unavailable rather than guessing. An external provider is optional (`AI_API_KEY` and
`AI_API_URL`).

## Health

`GET /health` returns service availability and does not require authentication.

## Vision analytics

Camera frames and pose landmarks are never sent to the API. The browser may
optionally submit an aggregate session summary after an analysis session:

| Method | Endpoint | Request |
| --- | --- | --- |
| POST | `/api/vision/sessions` | `{ "durationSeconds": 300, "sampleCount": 400, "averageLighting": 72, "averagePosture": 84, "lowConfidenceSeconds": 5, "breakSuggested": false, "modelVersion": "heuristic-v1" }` |
| GET | `/api/vision/analytics?days=7` | - |

Vision summaries are scoped to the authenticated user and contain no frames,
images, landmarks, biometric templates, or raw feature sequences.

## Ownership and validation

Every project and task is scoped to the authenticated user. A resource owned by
another user is indistinguishable from a missing resource and returns
`RESOURCE_NOT_FOUND`. Request bodies are validated before entering the service layer.
