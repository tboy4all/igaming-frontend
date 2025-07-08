import AuthForm from '../components/AuthForm'
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
  const navigate = useNavigate()

  const handleAuthSuccess = () => {
    navigate('/home')
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <AuthForm onAuth={handleAuthSuccess} />
    </div>
  )
}

export default AuthPage
