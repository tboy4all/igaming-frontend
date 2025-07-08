# 🎮 iGaming Frontend

This is the frontend interface of the iGaming platform. Users can register, log in, view a live countdown, join gaming sessions by submitting a guess (1–10), and see real-time results after each session ends.

## 🚀 Tech Stack

- **React** with **Vite**
- **Tailwind CSS** for styling
- **React Toastify** for notifications
- **React Icons** for UI icons
- Backend hosted on **Render**

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/tboy4all/igaming-frontend.git
cd igaming-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root and add:

```
VITE_API_URL=https://igaming-backend-a4z8.onrender.com
```

This tells the frontend where to send requests.

### 4. Run the development server

```bash
npm run dev
```

Your app should now be running at [http://localhost:5173](http://localhost:5173)

---

## 📺 Pages & Features

### ✅ **Authentication**

- `/register` and `/login` pages
- Token stored in `localStorage`
- Toast messages on success/error

### 🏠 **Home Page**

- Displays current session countdown
- Join session button navigates to GamePage

### 🎰 **Game Page**

- Users enter a number between 1–10
- After session ends, the result is shown
- Displays all winners and countdown to next session

---

## 🌐 API Integration

The frontend communicates with the following backend endpoints:

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user and receive JWT
- `GET /api/game/session-status` – Get current session status
- `GET /api/game/session` – Get Active session
- `POST /api/game/join` – Join a session
- `POST /api/game/enter` – Enter a session with a guess
- `GET /api/game/user-stat` – Get users status
- `POST /api/game/start` – Start Session
- `POST /api/game/end` – End Session
- `GET /api/game/top-players` – Fetch top 10 players by wins

---

### 📘 API Documentation (Swagger)

This project includes Swagger (OpenAPI) for exploring and testing the API interactively.

#### 🔗 Access Swagger UI for testing all endpoints

http://localhost:5000/api-docs

#### 📦 Powered by:

- swagger-ui-express
- swagger-jsdoc

JSDoc-style annotations are written in the routes/\*.js files.

You can test all endpoints (including /auth/login, /game/join, etc.) from the Swagger interface with real data.

## 📦 Production Build

To build for deployment:

```bash
npm run build
```

---
