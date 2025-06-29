import { useState } from 'react'
import AuthForm from '../components/AuthForm'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (username) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        toast.success('Registration successful!')
        navigate('/home')
      } else {
        toast.error(data.message || 'Registration failed.')
      }
    } catch {
      toast.error('Server error during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthForm
        onSubmit={handleRegister}
        title='Register'
        buttonText='Sign Up'
        redirectText='Already have an account?'
        redirectLink='/login'
        redirectLinkText='Login here'
      />
      {loading && <Spinner />}
    </>
  )
}
