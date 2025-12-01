# MoodMate – AI Journal with Sentiment & Mood Intelligence

## 1. Project Title
**MoodMate** – AI Journal with Sentiment Tracking & Mood Intelligence

## 2. Problem Statement
Many people struggle to consistently understand their emotional well-being. Traditional journaling helps in emotional expression but **does not provide insights into mood patterns, emotional triggers, or long-term mental health trends.**

**MoodMate** aims to bridge this gap by combining journaling with **AI-powered sentiment/emotion analysis**, extracting moods, identifying positive/negative triggers, and suggesting mood-improvement actions based on past data.

## 3. System Architecture

### Architecture Overview
**Frontend** → **Backend (API)** → **Database** → **AI Layer (Gemini API)**

### Tech Stack
*   **Frontend**: React.js, React Router, TailwindCSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB Atlas
*   **Authentication**: JWT (JSON Web Tokens)
*   **AI Layer**: Google Gemini API (sentiment analysis, mood tagging, event extraction, semantic search)
*   **Hosting**:
    *   Frontend: Vercel
    *   Backend: Render
    *   Database: MongoDB Atlas

## 4. Key Features

| Category | Features |
| :--- | :--- |
| **Authentication** | User signup/login/logout using JWT |
| **CRUD** | Create, read, update, delete journal entries |
| **AI Integration** | Sentiment & emotion analysis, mood detection, identification of positive/negative triggers, personalized mood-improvement suggestions |
| **Visualization** | Weekly/monthly mood trend charts |
| **Sorting & Filtering** | Sort by date, mood; filter by date range or sentiment category |
| **Pagination** | Paginated journal entry list for better readability and performance |
| **Search** | Keyword search + **Natural-language search** (e.g., "times I felt bored", "days I was stressed") |
| **Frontend Pages** | Home, Login, Dashboard, Journal Entry, Analytics |

## 7. API Endpoints

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/entries` | GET | Get paginated & filtered journal entries | Auth |
| `/api/entries` | POST | Add new entry + AI analysis | Auth |
| `/api/ai/search` | POST | Natural language / keyword search | Auth |
| `/api/auth/me` | GET | Get current user profile | Auth |

*(Note: Endpoints listed reflect the actual implementation)*
