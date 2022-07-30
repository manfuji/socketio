const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

// filtering the user array before adding user
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// removing user from socket ..helper function

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// fetching user
const getUser = (userId) => {
  return users.find((user) => user.userId == userId);
};

io.on('connection', (socket) => {
  console.log('a user connected');

  // after every connection take usetr id and socket id
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // sedn and receive message

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit('getMessage', { senderId, text });
  });

  // disconnecting a user from the socket
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
