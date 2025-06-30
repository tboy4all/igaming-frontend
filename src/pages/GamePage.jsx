/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../config'

export default function GamePage() {
  const [guess, setGuess] = useState('')
  const [userGuess, setUserGuess] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [hasGuessed, setHasGuessed] = useState(false)
  const [playersCount, setPlayersCount] = useState(0)
  const [result, setResult] = useState(null)
  const [winners, setWinners] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [nextSessionCountdown, setNextSessionCountdown] = useState(10)

  const [endTime, setEndTime] = useState(null)

  const countdownIntervalRef = useRef(null)

  const token = localStorage.getItem('token')

  const fetchSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/game/active-session`)
      const data = await res.json()

      if (data.active) {
        const start = new Date(data.startTime).getTime()
        const end = new Date(data.endTime).getTime()

        setSessionActive(true)
        setEndTime(end)
        setPlayersCount(data.playersCount || 0)
        setShowResult(false)

        // Start manual countdown from backend endTime
        startCountdown(end)
      } else {
        // No active session = session has ended
        handleSessionEnded()
      }
    } catch {
      toast.error('Error fetching session info')
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
        countdownIntervalRef.current = null
        setCountdown(0)
        handleSessionEnded()
      }
    }, 1000)
  }

  const handleSessionEnded = () => {
    setSessionActive(false)
    setCountdown(0)

    let attempts = 0
    const maxAttempts = 5

    const tryFetchResult = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/game/last-result`)
        const data = await res.json()

        if (res.ok && data.totalPlayers > 0) {
          setResult(data.winningNumber)
          setPlayersCount(data.totalPlayers)
          setWinners(data.winners)
          setShowResult(true)
          setHasGuessed(false)
          startNextSessionCountdown()
        } else {
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(tryFetchResult, 1000)
          } else {
            //  check if player actual join

            let fallbackPlayersCount = data.totalPlayers
            if (!fallbackPlayersCount || fallbackPlayersCount === 0) {
              fallbackPlayersCount = hasGuessed ? 1 : 0
            }

            setResult(data.winningNumber || 'N/A')
            setPlayersCount(fallbackPlayersCount)
            setWinners(data.winners || [])
            setShowResult(true)
            setHasGuessed(false)
            startNextSessionCountdown()
          }
        }
      } catch {
        toast.error('Could not load result')
      }
    }

    // Begin first attempt
    tryFetchResult()
  }

  const startNextSessionCountdown = () => {
    let c = 10
    setNextSessionCountdown(c)
    const next = setInterval(() => {
      c--
      setNextSessionCountdown(c)
      if (c <= 0) {
        clearInterval(next)
        setUserGuess(null)
        setShowResult(false)
        fetchSession()
      }
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsedGuess = parseInt(guess)
    if (!parsedGuess || parsedGuess < 1 || parsedGuess > 10) {
      toast.error('Pick a number from 1 to 10')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/game/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ guess: parsedGuess }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Guess Number submitted!')
        setHasGuessed(true)
        setUserGuess(parsedGuess)
        fetchSession()
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Submit failed')
    }
  }

  useEffect(() => {
    fetchSession()
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // --- 🎯 RESULT SCREEN ---
  if (showResult) {
    return (
      <div className='min-h-screen bg-gray-200 p-8 flex justify-between'>
        <div className='flex-1 flex flex-col items-center justify-center'>
          <p className='text-xl font-medium mb-2'>Result</p>
          <h1 className='text-5xl font-bold animate-bounce text-black'>
            {result}
          </h1>
          {userGuess && (
            <p className='mt-2 text-gray-700'>
              Your guess: <span className='font-bold'>{userGuess}</span>
            </p>
          )}
          <p className='mt-4'>Total players: {playersCount}</p>
          <p>Total wins: {winners.length}</p>
          <p className='text-red-600 mt-3'>
            New session starts in {nextSessionCountdown}s...
          </p>
        </div>

        <div className='w-1/3 bg-gray-400 p-4 rounded'>
          <h2 className='text-green-700 text-lg font-semibold mb-2'>Winners</h2>
          {winners.length > 0 ? (
            <ul className='text-black space-y-1'>
              {winners.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          ) : (
            <p className='text-white'>No winners this round.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-200 flex flex-col justify-center items-center text-center px-4'>
      <div className='absolute top-5 right-5 text-lg text-black'>
        Countdown time
        <br />
        <span className='text-2xl font-bold'>{countdown}s</span>
      </div>

      <p className='text-lg mb-4'>Pick a random number from 1 - 10</p>

      {!hasGuessed ? (
        <form onSubmit={handleSubmit} className='w-full max-w-xs'>
          <input
            type='number'
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className='w-full px-4 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring'
            placeholder='Enter your number'
            min='1'
            max='10'
            required
          />
          <button
            type='submit'
            className='mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 cursor-pointer'
            disabled={!sessionActive}
          >
            Submit
          </button>
        </form>
      ) : (
        <div className='flex flex-col items-center mt-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-700 mb-2'></div>
          <p className='text-gray-700'>Waiting for result...</p>
        </div>
      )}

      <p className='mt-6 text-green-700'>{playersCount} users joined</p>
    </div>
  )
}
