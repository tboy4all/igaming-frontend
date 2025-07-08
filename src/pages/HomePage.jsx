import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import API from '../utils/api'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const HomePage = () => {
  const token = localStorage.getItem('token')
  let decoded = {}
  try {
    decoded = jwtDecode(token)
  } catch {
    console.error('Invalid token')
  }

  const username = decoded?.username || 'User'
  const userId = decoded?.id

  const [wins, setWins] = useState(0)
  const [loses, setLoses] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [canJoin, setCanJoin] = useState(false)
  const [topPlayers, setTopPlayers] = useState([])

  const socketRef = useRef(null)
  const navigate = useNavigate()

  // 🔌 WebSocket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000')

    socketRef.current.on('sessionUpdate', (data) => {
      const { timeLeft, isJoinable } = data
      setCountdown(timeLeft)
      setCanJoin(isJoinable)

      if (!isJoinable) {
        setCanJoin(false)
      }
    })

    return () => socketRef.current?.disconnect()
  }, [])

  // 📊 Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/game/user-stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setWins(res.data.wins)
        setLoses(res.data.loses)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }

    if (token) fetchStats()
  }, [token])

  // 🏆 Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/game/top-players')
        setTopPlayers(res.data.slice(0, 5)) // Show only top 5
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
      }
    }

    fetchLeaderboard()
  }, [])

  // 🔘 Join button logic
  const handleJoin = async () => {
    try {
      await API.post(
        '/game/enter',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      navigate('/game')
    } catch {
      toast.error('❌ Failed to join session')
    }
  }

  return (
    <div className='min-h-screen bg-gray-200 p-6 flex flex-col items-center justify-center text-center relative'>
      <div className='absolute top-4 right-4 text-black font-semibold'>
        Hi {username}
      </div>

      <div className='text-lg mb-2'>
        Total Wins: <strong>{wins}</strong>
      </div>
      <div className='text-lg mb-6'>
        Total Loses: <strong>{loses}</strong>
      </div>

      <button
        onClick={handleJoin}
        disabled={!canJoin}
        className={`w-64 py-3 bg-black text-white rounded text-lg mb-4 ${
          !canJoin
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-800 cursor-pointer'
        }`}
      >
        JOIN
      </button>

      <p className='text-red-600 text-base'>
        {canJoin
          ? `There is an active session, you can join in ${countdown}s`
          : 'Waiting for next session...'}
      </p>

      {/* 🏆 Top Players Preview */}
      <div className='mt-10 w-full max-w-md text-left bg-white rounded-lg p-4 shadow'>
        <h2 className='text-lg font-bold text-gray-800 mb-2'>🏆 Top Players</h2>
        <ul>
          {topPlayers.length === 0 ? (
            <li className='text-sm text-gray-500'>No players yet</li>
          ) : (
            topPlayers.map((player, index) => (
              <li
                key={player.username}
                className='flex justify-between py-1 border-b border-gray-200 text-sm text-gray-700'
              >
                <span>
                  #{index + 1} {player.username}
                </span>
                <span>{player.wins} wins</span>
              </li>
            ))
          )}
        </ul>

        <div className='text-right mt-2'>
          <a
            href='/leaderboard'
            className='text-blue-600 text-sm hover:underline'
          >
            View full leaderboard →
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage
