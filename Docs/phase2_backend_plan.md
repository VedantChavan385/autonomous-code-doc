# Phase 2: Backend (Express + JavaScript + MongoDB)

## Overview
The Express backend sits between the React frontend and the FastAPI AI Server.
The frontend NEVER calls the AI Server directly — everything goes through this backend.

## Architecture Position

```
React Frontend
    ↓  REST API + WebSocket (Socket.IO)
Express Backend  ← YOU ARE HERE
    ↓  HTTP calls
AI Server (FastAPI) ← Already done ✅
    ↓
ChromaDB + Groq LLM
```

---

## Tech Stack

| Technology    | Role                                       |
|---------------|--------------------------------------------|
| Node.js       | Runtime                                    |
| Express       | HTTP web framework                         |
| JavaScript    | Standard programming language              |
| MongoDB       | Stores users, projects, chat history       |
| Mongoose      | MongoDB ORM / schema modeling              |
| BullMQ        | Redis-backed job queue for async processing|
| Redis         | Job queue broker + optional caching        |
| Socket.IO     | Real-time status push to frontend          |
| JWT + bcrypt  | Authentication and password hashing        |
| Zod           | Runtime request validation + schemas       |
| Winston       | Structured logging                         |

---

## Directory Structure

```
backend/
├── src/
│   ├── app.js                   # Express app setup
│   ├── server.js                # HTTP server entry
│   ├── config/
│   │   ├── index.js             # Env config loader
│   │   └── db.js                # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validate.js          # Zod request validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── project/
│   │   │   ├── project.controller.js
│   │   │   ├── project.service.js
│   │   │   ├── project.model.js      # Mongoose schema
│   │   │   ├── project.routes.js
│   │   │   └── project.validation.js
│   │   ├── chat/
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   ├── chat.model.js
│   │   │   ├── chat.routes.js
│   │   │   └── chat.validation.js
│   │   └── user/
│   │       ├── user.model.js
│   │       └── user.service.js
│   ├── jobs/
│   │   ├── queue.js             # BullMQ queue setup
│   │   └── processRepo.job.js   # Repo processing worker
│   ├── socket/
│   │   └── index.js             # Socket.IO for real-time updates
│   └── utils/
│       └── logger.js            # Winston logger
├── tests/
│   ├── auth.test.js
│   └── project.test.js
├── package.json
└── .env.example
```

---

## MongoDB Schema Design

### `users` collection
| Field          | Type     | Notes                          |
|----------------|----------|--------------------------------|
| `_id`          | ObjectId | Auto                           |
| `email`        | String   | Unique, indexed                |
| `passwordHash` | String   | bcrypt hashed                  |
| `name`         | String   |                                |
| `createdAt`    | Date     |                                |

### `projects` collection
| Field             | Type     | Notes                                         |
|-------------------|----------|-----------------------------------------------|
| `_id`             | ObjectId | Auto                                          |
| `userId`          | ObjectId | Ref → users (indexed)                         |
| `name`            | String   | Display name                                  |
| `repoUrl`         | String   | GitHub URL                                    |
| `status`          | String   | `pending` / `processing` / `ready` / `failed` |
| `fileCount`       | Number   | Total parsed files                            |
| `chunkCount`      | Number   | Total chunks stored                           |
| `errorMessage`    | String   | If status = failed                            |
| `chromaCollection`| String   | ChromaDB collection name                      |
| `createdAt`       | Date     |                                               |

### `chatSessions` collection
| Field      | Type     | Notes                      |
|------------|----------|----------------------------|
| `_id`      | ObjectId | Auto                       |
| `projectId`| ObjectId | Ref → projects             |
| `userId`   | ObjectId | Ref → users                |
| `messages` | Array    | Embedded message documents |

**Message sub-document:**
| Field     | Type   | Notes                    |
|-----------|--------|--------------------------|
| `role`    | String | `"user"` / `"assistant"` |
| `content` | String | Message text             |
| `sources` | Array  | `[{file, snippet}]`      |

---

## API Endpoints

| Method | Route                         | Auth | Description                |
|--------|-------------------------------|------|----------------------------|
| POST   | `/api/auth/register`          | No   | Create account             |
| POST   | `/api/auth/login`             | No   | Login, return JWT          |
| GET    | `/api/auth/me`                | Yes  | Get current user           |
| POST   | `/api/projects`               | Yes  | Create project (add repo)  |
| GET    | `/api/projects`               | Yes  | List user's projects       |
| GET    | `/api/projects/:id`           | Yes  | Get project detail/status  |
| DELETE | `/api/projects/:id`           | Yes  | Delete project             |
| POST   | `/api/projects/:id/chat`      | Yes  | Send chat message          |
| GET    | `/api/projects/:id/chat`      | Yes  | Get chat history           |

---

## Build Steps (in order)

### Step 1 - Scaffold
```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose bullmq ioredis socket.io jsonwebtoken bcryptjs axios zod winston
npm install -D nodemon
```

### Step 2 - Auth Module
- Hash passwords on register using `bcrypt` (12 rounds)
- Issue a signed JWT token on successful login
- Protect routes using a JWT middleware that reads `Authorization: Bearer <token>`

### Step 3 - Project Module
- `POST /api/projects` creates a MongoDB record, enqueues a **BullMQ job** and returns `202 Accepted`
- The HTTP request returns immediately without waiting for AI processing

### Step 4 - Chat Module
- `POST /api/projects/:id/chat` forwards the question to the AI Server's `POST /query`
- Saves question + answer + sources to `chatSessions` collection in MongoDB

### Step 5 - BullMQ Job Queue (Key Piece!)
- `queue.js` sets up a Redis-backed BullMQ queue named `"repo-processing"`
- `processRepo.job.js` is a worker that picks up jobs, calls `POST /process-repo` on the AI Server, and updates the project status in MongoDB

### Step 6 - Socket.IO
- When the worker completes (success or failure), it emits a WebSocket event to the user's browser
- The frontend automatically updates the project card status without a page refresh

---

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codebase-doc
REDIS_URL=redis://localhost:6379
AI_SERVER_URL=http://localhost:8000
JWT_SECRET=your_strong_secret_here
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

---

## How to start local development

```bash
# 1. Make sure MongoDB is running
mongod --dbpath ./data

# 2. Make sure Redis is running
redis-server

# 3. Start the backend in dev mode
cd backend
npm run dev
```
