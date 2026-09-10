# Adaptive AI Workspace

An authenticated, privacy-first adaptive workspace that combines productivity tools, grounded AI assistance, real-time webcam analysis, focus analytics, and personalized workspace automation.

## Features

- User registration with email verification
- Secure login using HTTP-only cookies
- Password reset by email verification code
- Profile editing and account deletion
- MongoDB Atlas/MongoDB persistence
- Projects and task management
- Document upload and text extraction
- Grounded AI/RAG chat over workspace documents and tasks
- Focus sessions with analytics
- Persistent workspace preferences
- Automation rules for lighting and audio
- Browser-only webcam analysis:
  - Lighting analysis
  - Posture alignment estimation
  - Fatigue estimation
  - MediaPipe pose landmarks
- Privacy-first camera processing
- Responsive React interface
- Production deployment configuration for Render and Vercel

## Technology Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- HTTP-only cookies
- bcrypt
- Zod validation
- Nodemailer
- Multer
- PDF and DOCX extraction
- Helmet
- CORS
- Rate limiting

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- MediaPipe Tasks Vision

## Project Structure

```text
.
├── src/
│   ├── ai/                    # Retrieval and AI chat services
│   ├── config/                # Environment and database configuration
│   ├── controllers/           # HTTP request controllers
│   ├── middleware/            # Authentication, validation, errors, uploads
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Shared utilities
│   ├── app.js                 # Express application
│   └── server.js              # Server startup
├── frontend/
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── context/           # Authentication and workspace state
│   │   ├── services/          # Frontend API client
│   │   ├── views/             # Application screens
│   │   └── utils/             # Browser utilities
│   └── package.json
├── docs/
├── Dockerfile
├── render.yaml
└── .env.example
