import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ResultPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!state) return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate('/home') // redirect to homepage
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [navigate, state])

  if (!state) return <div>No result to show.</div>

  const { winningNumber, totalPlayers, totalWins, winners } = state

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel */}
      <div className='w-2/3 bg-gray-300 flex flex-col justify-center items-center text-center p-10'>
        <h2 className='text-lg'>Result</h2>
        <h1 className='text-6xl font-bold my-2'>{winningNumber}</h1>

        <p className='mt-4 text-xl'>
          total players: <strong>{totalPlayers}</strong>
        </p>
        <p className='text-xl'>
          total wins: <strong>{totalWins}</strong>
        </p>

        <p className='text-red-600 text-base mt-6'>
          new session starts in {countdown}...
        </p>
      </div>

      {/* Right Panel */}
      <div className='w-1/3 bg-gray-600 p-10 text-white'>
        <h2 className='text-green-500 text-xl mb-4'>Winners</h2>
        {winners.length === 0 ? (
          <p className='text-sm text-red-200'>No winners this round.</p>
        ) : (
          winners.map((user, i) => (
            <p className='text-gray-950' key={i}>
              {user}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

export default ResultPage
