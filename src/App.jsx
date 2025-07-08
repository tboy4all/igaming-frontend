import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFound'
import GamePage from './pages/GamePage'
import ResultPage from './pages/ResultPage'
import LeaderboardPage from './pages/LeaderboardPage'

function App() {
  return (
    <Router>
      <ToastContainer
        position='top-left'
        autoClose={3000}
        reverseOrder={false}
      />
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/result' element={<ResultPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
