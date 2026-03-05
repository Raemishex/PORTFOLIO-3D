import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';

import http from 'http';
import { Server } from 'socket.io';

import { seedDB } from './seed.js';

dotenv.config();
connectDB().then(() => {
  seedDB();
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running successfully' });
});

// Socket.IO Logic
const users = new Map(); // Store active users: userId => socketId

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user logs in / connects, they emit 'setup' with their user ID
  socket.on('setup', (userData) => {
    if(userData && userData._id) {
       socket.join(userData._id);
       users.set(userData._id, socket.id);
       console.log(`User ${userData._id} joined room`);
       socket.emit('connected');
    }
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
  });

  socket.on('new message', (newMessageReceived) => {
    let receiver = newMessageReceived.receiver;
    if (!receiver) return console.log('Message receiver not defined');

    // Emit the message to the receiver's room
    socket.in(receiver).emit('message received', newMessageReceived);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
