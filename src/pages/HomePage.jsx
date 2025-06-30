/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

export default function HomePage() {
  const [user, setUser] = useState({ username: '', wins: 0, losses: 0 })
  const [countdown, setCountdown] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [endTime, setEndTime] = useState(null)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const countdownIntervalRef = useRef(null)
  const sessionPollIntervalRef = useRef(null)

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const fetchSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/game/active-session`)
      const data = await res.json()
      if (data.active) {
        const end = new Date(data.endTime).getTime()
        const now = Date.now()
        const timeLeft = Math.floor((end - now) / 1000)

        if (timeLeft > 0) {
          setEndTime(end)
          setCountdown(timeLeft)
          setSessionActive(true)
          startCountdown(end)

          // Stop polling once session becomes active
          if (sessionPollIntervalRef.current) {
            clearInterval(sessionPollIntervalRef.current)
            sessionPollIntervalRef.current = null
          }
        }
      } else {
        setSessionActive(false)
        setCountdown(0)
      }
    } catch {
      toast.error('Failed to fetch session info.')
    }
  }

  const startCountdown = (endTimestamp) => {
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current)

    countdownIntervalRef.current = setInterval(() => {
      const now = Date.now()
      const timeLeft = Math.floor((endTimestamp - now) / 1000)

      if (timeLeft > 0) {
        setCountdown(timeLeft)
      } else {
        clearInterval(countdownIntervalRef.current)
        setCountdown(0)
        setSessionActive(false)
        startPollingForNextSession()
      }
    }, 1000)
  }

  const startPollingForNextSession = () => {
    if (sessionPollIntervalRef.current) return

    sessionPollIntervalRef.current = setInterval(() => {
      console.log('[DEBUG] Checking for next session...')
      fetchSession()
    }, 3000)
  }

  useEffect(() => {
    fetchUser()
    fetchSession()

    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current)
      if (sessionPollIntervalRef.current)
        clearInterval(sessionPollIntervalRef.current)
    }
  }, [])

  const goToGamePage = () => {
    navigate('/game')
  }

  return (
    <div className='min-h-screen bg-gray-200 flex flex-col justify-center items-center px-4'>
      <div className='absolute top-5 right-5 text-gray-700 font-medium'>
        Hi {user.username}
      </div>

      <div className='text-center space-y-2 mb-10'>
        <p className='text-lg'>Total Wins: {user.wins}</p>
        <p className='text-lg'>Total Losses: {user.losses}</p>
      </div>

      <button
        onClick={goToGamePage}
        disabled={!sessionActive}
        className={`w-60 py-3 text-white font-semibold rounded transition ${
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
