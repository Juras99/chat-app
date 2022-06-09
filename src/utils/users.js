const users = []

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim()
  room = room.trim().toUpperCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Nazwa użytkownika i pokój są wymagane',
    }
  }

  if (username.length > 20) {
    return {
      error: 'Nazwa użytkownika nie może być dłuższa niż 20',
    }
  }

  if (room.length >= 20) {
    return {
      error: 'Nazwa pokoju nie może być dłuższa niż 20',
    }
  }

  // Check for existing user

  const existingUser = users.find(user => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Nazwa użytkownika jest już w użyciu!',
    }
  }

  // Store user

  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = id => {
  const index = users.findIndex(user => user.id === id)

  if (index != -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = id => {
  return users.find(user => user.id === id)
}

const getUsersInRoom = room => {
  return users.filter(user => user.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
}
