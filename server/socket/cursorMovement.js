const connectedUsers = new Map(); // socket.id => { userId, name, avatar }

export default function setupWhiteboardSocket(socket, io) {
  // When user connects, save their metadata
  socket.on('user:join', (userData) => {
    connectedUsers.set(socket.id, userData); // { id, name, avatar }
  });

  // Mouse position update
  socket.on('cursor:move', ({ x, y }) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('cursor:update', {
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        x, y
      });
    }
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    io.emit('cursor:leave', { userId: socket.id });
  });
}
