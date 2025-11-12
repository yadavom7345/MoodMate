## **Demo Proposal – AP Capstone Project**

### **1\. Project Title**

**MoodMate – AI Journal with Sentiment Tracking**

---

### **2\. Problem Statement**

Many people struggle to consistently understand or monitor their emotional well-being. Traditional journaling helps express feelings but does not provide insights into mood patterns or triggers.  
 **MoodMate** aims to solve this by combining journaling with AI-powered sentiment analysis, helping users visualize their mood trends and emotional health over time.

---

### **3\. System Architecture**

**Architecture Overview:**  
 Frontend → Backend (API) → Database → AI (OpenAI API)

**Example Stack:**

* **Frontend:** React.js with React Router for page navigation

* **Backend:** Node.js \+ Express

* **Database:** MongoDB Atlas (non-relational)

* **Authentication:** JWT-based login/signup system

* **AI Integration:** OpenAI API for analyzing journal entries' emotional tone

* **Hosting:**

  * Frontend → Vercel

  * Backend → Render / Railway

  * Database → MongoDB Atlas

---

### **5\. Key Features**

| Category | Features |
| ----- | ----- |
| **Authentication & Authorization** | User registration, login, and logout with JWT-based authentication |
| **CRUD Operations** | Create, read, update, and delete daily journal entries |
| **AI Integration** | Sentiment analysis using OpenAI API to determine mood of each entry |
| **Visualization** | Mood trend chart showing weekly/monthly emotional changes |
| **Frontend Routing** | Pages: Home, Login, Dashboard, Journal Entry, Analytics |
| **Filtering & Sorting** | Filter entries by date range, sentiment type (positive/neutral/negative) |
| **Hosting** | Deploy frontend and backend to Vercel and Render for public access |

---

### **6\. Tech Stack**

| Layer | Technologies |
| ----- | ----- |
| **Frontend** | React.js, React Router, Axios, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JWT Authentication |
| **AI** | OpenAI API for sentiment analysis |
| **Hosting** | Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas (Database) |

---

### **7\. API Overview**

| Endpoint | Method | Description | Access |
| ----- | ----- | ----- | ----- |
| `/api/auth/signup` | POST | Register new user | Public |
| `/api/auth/login` | POST | Authenticate user and issue token | Public |
| `/api/journal` | GET | Get all journal entries for a user | Authenticated |
| `/api/journal` | POST | Add a new journal entry (triggers AI analysis) | Authenticated |
| `/api/journal/:id` | PUT | Edit an existing entry | Authenticated |
| `/api/journal/:id` | DELETE | Delete a journal entry | Authenticated |
| `/api/analysis/trends` | GET | Fetch mood trends and visual data | Authenticated |

---

### **Summary**

**MoodMate** empowers users to take charge of their emotional health by transforming simple journal entries into meaningful insights.  
 By integrating AI-driven sentiment analysis and visual mood tracking, it provides a unique, data-backed approach to self-care — combining **technology, psychology, and design** in one accessible platform.
