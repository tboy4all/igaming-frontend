import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

const LeaderboardPage = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const res = await API.get('/game/top-players')
        setPlayers(res.data)
      } catch (err) {
        setError('❌ Failed to load leaderboard.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopPlayers()
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 p-6 flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
        🏆 Leaderboard
      </h1>

      {loading ? (
        <p className='text-gray-600'>Loading top players...</p>
      ) : error ? (
        <p className='text-red-600'>{error}</p>
      ) : (
        <div className='w-full max-w-md'>
          <table className='w-full border border-gray-400 rounded-lg bg-white'>
            <thead>
              <tr className='bg-gray-200 text-left text-gray-700'>
                <th className='px-4 py-2'>Rank</th>
                <th className='px-4 py-2'>Username</th>
                <th className='px-4 py-2'>Wins</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={player.username}
                  className='border-t border-gray-300 hover:bg-gray-100'
                >
                  <td className='px-4 py-2 font-semibold'>{index + 1}</td>
                  <td className='px-4 py-2'>{player.username}</td>
                  <td className='px-4 py-2'>{player.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link
        to='/home'
        className='mt-6 inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800'
      >
        ← Back to Home
      </Link>
    </div>
  )
}

export default LeaderboardPage
