# Adaptive AI Workspace Backend

Node.js/Express backend foundation with MongoDB/Mongoose persistence, JWT + bcrypt authentication, Zod request validation, and user-scoped Project and Task CRUD APIs.

## Setup

```bash
npm install
copy .env.example .env
# Start MongoDB, then:
npm start
```

Set a strong `JWT_SECRET` in production. The server defaults to port 3000.

## API

- `GET /health`
- `POST /api/auth/register` (`name`, `email`, `password`)
- `POST /api/auth/login` (`email`, `password`)
- `GET /api/auth/me`
- `PATCH /api/auth/me` (`name` and/or `email`)
- `POST /api/auth/logout` (revokes the current token in this process)
- Authenticated with `Authorization: Bearer <token>`:
  - `GET|POST /api/projects`
  - `GET|PUT|PATCH|DELETE /api/projects/:id`
  - `GET|POST /api/tasks`
  - `GET|PUT|PATCH|DELETE /api/tasks/:id`
  - `POST /api/documents` (multipart field `file`, optional `projectId`)
  - `GET|DELETE /api/documents/:id` and `GET /api/documents`
  - `POST /api/ai/chat` (`{ "message": "..." }`) for authenticated, grounded workspace chat

Projects support `status`, `priority`, and `search` query filters. Tasks support `projectId`, `status`, `priority`, and `deadline` query filters. Success responses use `{ success: true, data }`; errors use `{ success: false, error: { code, message } }` (validation errors may also include `error.details`). Logout uses an in-memory token denylist, so revoked tokens remain invalid until expiry within the running process.

AI chat uses deterministic local retrieval over the user's documents, pending tasks,
and active projects. Configure both `AI_API_KEY` and `AI_API_URL` to enable an
optional provider; without them, responses remain local and explicitly say when
context is unavailable. See `docs/RAG_ARCHITECTURE.md`.

Adaptive Vision is an opt-in browser-only webcam experience. It never uploads
camera frames. Posture alignment and fatigue are on-device, heuristic estimates
from pose landmarks, stillness, and session duration—not medical assessments.
If camera permission or the model is unavailable, lighting analysis and the rest
of the workspace remain usable. See `docs/PRIVACY_SECURITY.md` for the privacy boundary.

## Validation

```bash
npm test
npm run check
```
