import { Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express(); //express app
const server = http.createServer(app); // Create an HTTP server

const io = new Server(server, {
  //handle cors error
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
});

// Function to get the socket ID of the receiver
export function getReceiverSocketId(userID) {
  return userSocketMap[userID];
}

// Map used to store online users
const userSocketMap = {}; // {userId: socketId}

// Handle socket connection (listen for events)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId; // Get userId from query params (useAuthStore)
  if (userId) {userSocketMap[userId] = socket.id}; // Map userId to socketId

  // io.emit() is used to send messages to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete userSocketMap[userId]; // Remove user from map upon disconnect
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users
  });

});

export { io, app, server }; //export io instance

