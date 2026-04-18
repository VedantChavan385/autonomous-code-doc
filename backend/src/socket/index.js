import { Server } from 'socket.io';
import config from '../config/index.js';

let io;

export const initSocket = (server) => {
  // Attach the radio tower (Socket.IO) to our Express HTTP server
  io = new Server(server, {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`📡 New frontend client connected to Socket.IO`);

    // A user can tell the server "I only want to listen for updates about Project 123"
    socket.on('join_project_room', (projectId) => {
      socket.join(projectId.toString());
      console.log(`User joined live-updates room for project: ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from Socket.IO');
    });
  });

  return io;
};

// Export a helper function so our Background Worker can easily shout over the radio
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
