# Adaptive AI Workspace Project

## Project Goal

Build a workspace that adapts to the user's tasks, focus sessions, documents, and preferences.

## Current Priorities

1. Complete backend authentication.
2. Connect projects and tasks to MongoDB.
3. Implement document upload and text extraction.
4. Build grounded AI chat using document context.
5. Add focus sessions and productivity analytics.

## Important Technical Details

- Backend: Node.js and Express
- Frontend: React and Vite
- Database: MongoDB
- Authentication: JWT and bcrypt
- Documents: PDF, DOCX, TXT, and Markdown
- AI responses must use available workspace context.
- The system must say when information is unavailable.
- Users must never access another user's projects, tasks, or documents.

## Current Status

Authentication, projects, tasks, document processing, and basic RAG chat are implemented.

## Next Step

Implement persistent focus sessions and analytics.

## Success Criteria

- Users can register and log in.
- Projects and tasks persist in MongoDB.
- Documents can be uploaded and searched.
- AI answers include relevant sources.
- Focus sessions contribute to productivity analytics.