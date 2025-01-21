import { socketApi } from '@/app/api/api'
import { io } from 'socket.io-client'

const socket = io(socketApi, {
  transports: ['websocket']
})
socket.on('connect', () => {
  console.log(`SOCKET CONNECTED ${socketApi}`)
})
export default socket