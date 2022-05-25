const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')

const port = 8000
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.resolve(__dirname, '../public')))

io.on('connection', () => {
  console.log('New WebSocket connection')
})

server.listen(port, () => {
  console.log('Server is up on port ' + port)
})
