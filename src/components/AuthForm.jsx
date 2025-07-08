import { useState } from 'react'
import API from '../utils/api'
import { toast } from 'react-toastify'

const AuthForm = ({ onAuth }) => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) return toast.error('Username is required')

    setLoading(true)

    try {
      const res = await API.post('/auth/login', { username })
      localStorage.setItem('token', res.data.token)
      toast.success('Welcome back!')
      onAuth()
    } catch {
      try {
        const res = await API.post('/auth/register', { username })
        localStorage.setItem('token', res.data.token)
        toast.success('Account created!')
        onAuth()
      } catch {
        toast.error('❌ Username already taken or error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto mt-20'
    >
      <h2 className='text-2xl font-bold mb-6 text-center'>Join iGaming</h2>
      <input
        type='text'
        placeholder='Enter username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className='w-full px-3 py-2 mb-4 border rounded'
        required
        autoFocus
        disabled={loading}
        autoComplete='username'
      />
      <button
        type='submit'
        disabled={loading}
        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer'
      >
        {loading ? 'Loading...' : 'Login / Register'}
      </button>
    </form>
  )
}

export default AuthForm
