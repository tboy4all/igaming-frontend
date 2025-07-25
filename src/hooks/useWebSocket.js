import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL)?.replace(
    /\/api\/?$/,
    ''
  ) || 'http://localhost:5000'

const useWebSocket = () => {
  const socketRef = useRef(null)
  const [sessionData, setSessionData] = useState({
    timeLeft: 0,
    isJoinable: false,
  })

  useEffect(() => {
    socketRef.current = io(SOCKET_URL)

    socketRef.current.on('sessionUpdate', (data) => {
      setSessionData({
        timeLeft: data.timeLeft,
        isJoinable: data.isJoinable,
      })
    })

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to WebSocket server')
    })

    socketRef.current.on('disconnect', () => {
      console.warn('⚠️ Disconnected from WebSocket')
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  return { socket: socketRef.current, ...sessionData }
}

export default useWebSocket
