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
VITE_API_BASE_URL=https://igaming-backend-0y7x.onrender.com
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

- `POST /api/v1/auth/register` – Register a new user
- `POST /api/v1/auth/login` – Login user and receive JWT
- `GET /api/v1/game/active-session` – Get current session status
- `POST /api/v1/game/join` – Join a session with a guess
- `GET /api/v1/game/last-result` – Get result after session ends
- `GET /api/v1/game/leaderboard` – Fetch top 10 players by wins

---

## 📦 Production Build

To build for deployment:

```bash
npm run build
```

---
