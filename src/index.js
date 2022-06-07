const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const ejs = require('ejs')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 8000
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../public/views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(publicDirectoryPath))

app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.get('/', (req, res) => {
  const username = ''
  const room = ''
  const disabled = ''
  const enabled = 'disabled'
  res.render('index', { username, room, disabled, enabled })
})

app.get('/join/:room', (req, res) => {
  const username = ''
  const room = req.params.room
  const disabled = 'disabled'
  const enabled = ''
  res.render('index', { username, room, disabled, enabled })
})

app.post('/', function (req, res) {
  const username = req.body.username
  const room = req.body.room
  const disabled = ''
  const enabled = 'disabled'
  res.render('index', { username, room, disabled, enabled })
})

app.get('/chat', (req, res) => {
  console.log(req.body)
  res.render('chat')
})

io.on('connection', socket => {
  console.log('New WebSocket connection')

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room })
    if (error) {
      return callback(error)
    }

    socket.join(user.room)

    socket.emit('welcomeMessage', generateMessage('Admin', `Dołączyłeś do pokoju`))
    socket.broadcast.to(user.room).emit('welcomeMessage', generateMessage('Admin', `${user.username} dołączył do pokoju`))

    io.to(user.room).emit('roomData', {
      room: user.room,
      user: user.username,
      users: getUsersInRoom(user.room),
    })

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter()

    if (filter.isProfane(message)) {
      socket.emit('message', generateMessage('Admin', 'Przekleństwa nie są dozwolone!'))
      return callback('Profanity is not allowed')
    }

    socket.to(user.room).emit('message', generateMessage(user.username, message))
    socket.emit('myMessage', generateMessage(user.username, message))
    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('welcomeMessage', generateMessage('Admin', `${user.username} opuścił pokój!`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      })
    }
  })

  socket.on('sendLocation', (location, callback) => {
    const user = getUser(socket.id)
    socket.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
    socket.emit('myLocationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
    callback()
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
