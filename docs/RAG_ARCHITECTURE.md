# Phase 2 RAG architecture

`POST /api/ai/chat` retrieves only records owned by the authenticated user. Completed
documents are split into overlapping character chunks and ranked with deterministic
token overlap. Pending tasks (`todo`, `in_progress`, `blocked`) and active projects
are ranked using their titles and metadata in the same index.

The chat service passes the ranked snippets to an optional provider configured with
`AI_API_KEY` and `AI_API_URL`. Provider failures, missing configuration, or an empty
retrieval result use the deterministic local response. The local response quotes
retrieved snippets and explicitly reports that information is unavailable when no
context matches; it does not infer facts or execute actions. Sources are returned so
clients can show provenance.

## Adaptive Vision boundary

Adaptive Vision is separate from RAG and runs entirely in the browser. It uses a
local brightness sample and explicit self-checks for non-medical suggestions.
Vision frames and derived per-frame data never enter retrieval, chat, logs, or
the backend.
