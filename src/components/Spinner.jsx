// src/components/Spinner.jsx
import { FaSpinner } from 'react-icons/fa'

export default function Spinner() {
  return (
    <div className='flex justify-center mt-4'>
      <FaSpinner className='animate-spin text-blue-600 text-3xl' />
    </div>
  )
}
