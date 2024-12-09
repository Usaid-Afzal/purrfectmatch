// src/config/socket.js
const { Server } = require('socket.io');

let io;

function initSocket(httpServer) {
  // Create a new Socket.IO server instance
  io = new Server(httpServer, {
    cors: {
      origin: "*", // adjust based on your frontend origin
      methods: ["GET", "POST"]
    }
  });

  // Handle new connections
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Example: user joins a "room" for chatting.
    // In a real app, you'd listen for a "joinRoom" event from the client:
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle incoming chat messages
    socket.on('chatMessage', ({ roomId, message, sender }) => {
      // Broadcast the message to others in the room
      socket.to(roomId).emit('chatMessage', { message, sender, timestamp: Date.now() });
    });

    // When the socket disconnects
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}

module.exports = { initSocket, getIO };
