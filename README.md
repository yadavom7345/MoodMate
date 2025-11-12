# MoodMate - AI Journal with Sentiment Tracking

A full-stack web application for journaling with AI-powered sentiment analysis and mood tracking.

## Project Structure

```
MoodMate/
├── backend/          # Node.js + Express API
├── frontend/         # React.js frontend
└── moodmate.md       # Project proposal
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. **Get MongoDB Atlas Connection String:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account
   - Create a new cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add your IP address to the whitelist

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   Note: If you don't create this file, it will default to `http://localhost:5000/api`

4. Start the frontend development server:
   ```bash
   npm start
   ```
   The app will open in your browser at `http://localhost:3000`

## Features Implemented

✅ User authentication (Signup & Login)
✅ JWT-based authentication
✅ Protected routes
✅ Beautiful UI with TailwindCSS
✅ Responsive design

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Health Check
- `GET /api/health` - Check if server is running

## Next Steps

- [ ] Journal entry CRUD operations
- [ ] AI sentiment analysis integration
- [ ] Mood trend visualization
- [ ] Filtering and sorting entries

## Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- TailwindCSS

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`

Make sure both servers are running for the full application to work!

