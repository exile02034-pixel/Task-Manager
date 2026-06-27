Task Manager (MERN)

A fullstack task management app — create, edit, complete, delete, search, and filter tasks.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express (ES Modules)
- Database: MongoDB (Mongoose)

## Prerequisites
- Node.js v18+
- MongoDB running locally OR a MongoDB Atlas connection string

## Setup

### 1. Clone
\`\`\`bash
git clone <repo-url>
cd task-manager
\`\`\`

### 2. Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env   # set MONGO_URI and PORT
npm run dev            # http://localhost:5000
\`\`\`

### 3. Frontend
\`\`\`bash
cd frontend
npm install
npm run dev             # http://localhost:5173
\`\`\`

## Environment Variables

backend/.env
\`\`\`
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
CLIENT_URL=http://localhost:5173
\`\`\`

frontend/.env
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks?search=&status= | List/search/filter tasks |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| PATCH | /api/tasks/:id/toggle | Toggle complete status |
| DELETE | /api/tasks/:id | Delete a task |

## Notes
- No authentication — tasks are global/shared by design (per exam scope).
