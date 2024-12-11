import socket from '@/utils/socket'

export const EmitSocket = (path: string, payload?: any) => {
  console.log('Emitting', path, payload)
  socket.emit(path, payload)
}