# MoodMate Backend

Node.js + Express API server for MoodMate application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check

