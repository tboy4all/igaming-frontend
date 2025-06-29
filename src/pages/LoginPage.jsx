import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../config'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (username) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        toast.success('Login successful!')
        navigate('/home')
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthForm
        onSubmit={handleLogin}
        title='Login'
        buttonText='Login'
        redirectText="Don't have an account?"
        redirectLink='/register'
        redirectLinkText='Register here'
      />
      {loading && <Spinner />}
    </>
  )
}
