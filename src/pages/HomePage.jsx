/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

export default function HomePage() {
  const [user, setUser] = useState({ username: '', wins: 0, losses: 0 })
  const [countdown, setCountdown] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)

  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // Fetch user stats
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        const totalGames = data.totalGames || 0
        const losses = totalGames - data.wins
        setUser({ username: data.username, wins: data.wins, losses })
      }
    } catch {
      toast.error('Failed to fetch user info.')
    }
  }

  // Fetch session info
  const fetchSession = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/game/active-session`
      )
      const data = await res.json()
      if (data.active) {
        const start = new Date(data.startTime).getTime()
        const end = new Date(data.endTime).getTime()
        const now = Date.now()

        const timeLeft = Math.floor((end - now) / 1000)

        setStartTime(start)
        setEndTime(end)
        setCountdown(timeLeft > 0 ? timeLeft : 0)
        setSessionActive(true)
      } else {
        setCountdown(0)
        setSessionActive(false)
      }
    } catch {
      toast.error('Failed to fetch session info.')
    }
  }



  const goToGamePage = () => {
    navigate('/game')
  }

  // Fetch every second to keep countdown accurate
  useEffect(() => {
    fetchUser()
    fetchSession()
    const interval = setInterval(fetchSession, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-gray-200 flex flex-col justify-center items-center px-4'>
      <div className='absolute top-5 right-5 text-gray-700 font-medium'>
        Hi {user.username}
      </div>

      <div className='text-center space-y-2 mb-10'>
        <p className='text-lg'>Total Wins: {user.wins}</p>
        <p className='text-lg'>Total Loses: {user.losses}</p>
      </div>

      <button
        onClick={goToGamePage}
        disabled={!sessionActive}
        className={`w-60 py-3 text-white font-semibold rounded transition cursor-pointer ${
          sessionActive
            ? 'bg-black hover:bg-gray-800'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        JOIN
      </button>

      <p className='mt-4 text-red-600 text-center'>
        {sessionActive
          ? `There is an active session, you can join in ${countdown}s`
          : 'Waiting for the next session...'}
      </p>
    </div>
  )
}
