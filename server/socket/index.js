import { Server } from 'socket.io';
import handleWhiteboardEvents from './whiteBoardHandler.js';
import setupWhiteboardSocket from './cursorMovement.js';

const userFollowMap = {};
const userSocketMap = {};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // for dev; restrict in production
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('⚡ New client connected: ' + socket.id);

    handleWhiteboardEvents(socket);
    setupWhiteboardSocket(socket,io)

    // 1. JOIN PROJECT ROOM
    socket.on('join_project', (projectId) => {
      socket.join(projectId);
      console.log(`🔗 Socket ${socket.id} joined project ${projectId}`);
    });

    // 2. HANDLE TASK UPDATE AND BROADCAST
    socket.on('task_updated', ({ projectId, task }) => {
      socket.to(projectId).emit('task_updated', task);
      console.log(`📡 Task updated for project ${projectId}`);
    });

    const userId = socket.handshake.auth.userId; // assume userId is sent during handshake
    userSocketMap[userId] = socket.id;
    userFollowMap[socket.id] = new Set();

    // When a user moves their mouse
    socket.on('cursor-update', (cursorData) => {
      // Send cursor only to followers
      for (const [socketId, followingSet] of Object.entries(userFollowMap)) {
        if (followingSet.has(userId)) {
          io.to(socketId).emit('cursor-follow', { userId, ...cursorData });
        }
      }
    });

    // When a user clicks to follow someone
    socket.on('follow-user', (followedUserId) => {
      userFollowMap[socket.id].add(followedUserId);
      socket.emit('update-following', Array.from(userFollowMap[socket.id]));
    });

    // Optional: unfollow
    socket.on('unfollow-user', (unfollowedUserId) => {
      userFollowMap[socket.id].delete(unfollowedUserId);
      socket.emit('update-following', Array.from(userFollowMap[socket.id]));
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected: ' + socket.id);
      delete userFollowMap[socket.id];
      for (const [uid, sid] of Object.entries(userSocketMap)) {
        if (sid === socket.id) delete userSocketMap[uid];
      }
    });
});

  return io;
};
