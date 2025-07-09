import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { io } from 'socket.io-client'
import API from '../utils/api'
import { toast } from 'react-toastify'

const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL)?.replace(
    /\/api\/?$/,
    ''
  ) || 'http://localhost:5000'

const GamePage = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)
  const username = decoded?.username || 'User'

  const [timeLeft, setTimeLeft] = useState(0)
  const [totalJoined, setTotalJoined] = useState(0)
  const [pickedNumber, setPickedNumber] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const socketRef = useRef(null)

  // WebSocket connection for live updates
  useEffect(() => {
    socketRef.current = io(SOCKET_URL)

    // ⏱️ Countdown + join count
    socketRef.current.on('sessionUpdate', (data) => {
      setTimeLeft(data.timeLeft)
      setTotalJoined(data.totalUsers)

      if (!data.isJoinable) {
        setSubmitted(false)
        setPickedNumber('')
      }
    })

    // 🎯 Listen for game result → redirect to ResultPage
    socketRef.current.on('sessionResult', (data) => {
      navigate('/result', { state: data }) // Pass result data to next page
    })

    return () => socketRef.current.disconnect()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const num = parseInt(pickedNumber)
    if (isNaN(num) || num < 1 || num > 10) {
      toast.error('Please enter a number between 1 and 10')
      return
    }

    try {
      await API.post(
        '/game/join',
        { pickedNumber: num },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSubmitted(true)
      toast.success('✅ Number submitted successfully!')
    } catch (err) {
      toast.error(err.response?.data?.msg || '❌ Failed to join session')
    }
  }

  return (
    <div className='min-h-screen bg-gray-300 p-4 flex flex-col items-center justify-center text-center relative'>
      <div className='absolute top-4 right-4 text-sm sm:text-lg'>
        Countdown timer
        <br />
        <span className='text-3xl sm:text-4xl font-bold'>{timeLeft}s</span>
      </div>

      <h2 className='text-lg sm:text-xl mb-4 sm:mb-6'>
        Pick a random number from 1 - 10
      </h2>

      <form
        onSubmit={handleSubmit}
        className='mb-4 w-full max-w-xs sm:max-w-sm flex flex-col sm:flex-row gap-3 sm:gap-4'
      >
        <input
          type='number'
          min='1'
          max='10'
          value={pickedNumber}
          disabled={submitted}
          onChange={(e) => setPickedNumber(e.target.value)}
          className='flex-1 px-4 py-2 rounded border border-gray-400 text-center text-lg'
          placeholder='Enter a number'
        />
        <button
          type='submit'
          disabled={submitted}
          className='px-6 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer w-full sm:w-auto'
        >
          {submitted ? 'Submitted' : 'Submit'}
        </button>
      </form>

      <p className='text-green-700 text-base'>
        {totalJoined} {totalJoined === 1 ? 'user' : 'users'} joined
      </p>

      {submitted && (
        <p className='mt-3 text-blue-700 text-sm'>
          You've selected number {pickedNumber}. Wait for session to end.
        </p>
      )}
    </div>
  )
}

export default GamePage
