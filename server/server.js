const http = require('http')
const socketIo = require('socket.io')

// http server
const app = http.createServer()
app.listen(3000, '0.0.0.0')

const io = socketIo.listen(app)

io.sockets.on('connection', (socket) => {
  socket.on('message', (room, data, val) => {
    socket.to(room).emit('message', data, val)// 房间内所有人,除自己外
  })

  socket.on('join', (roomId, userName) => {
    socket.join(roomId)
  })
})
