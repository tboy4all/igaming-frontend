import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AuthForm({
  onSubmit,
  title,
  buttonText,
  redirectText,
  redirectLink,
  redirectLinkText,
}) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(username)
  }

  return (
    <div className='max-w-md mx-auto mt-20 p-8 bg-white shadow-xl rounded-xl'>
      <h2 className='text-2xl font-bold mb-6 text-center'>{title}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter username'
          className='w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer'
        >
          {buttonText}
        </button>
      </form>

      <p className='mt-4 text-center text-sm text-gray-600'>
        {redirectText}{' '}
        <Link to={redirectLink} className='text-blue-600 hover:underline'>
          {redirectLinkText}
        </Link>
      </p>
    </div>
  )
}
