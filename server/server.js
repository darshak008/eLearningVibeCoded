require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/v1/auth', limiter);

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/courses', require('./routes/courses'));
app.use('/api/v1/courses/:courseId/modules', require('./routes/modules'));
app.use('/api/v1/modules/:moduleId/lessons', require('./routes/lessons'));
app.use('/api/v1/enrollments', require('./routes/enrollments'));
app.use('/api/v1/courses/:courseId/reviews', require('./routes/reviews'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/courses/:courseId/quizzes', require('./routes/quizzes'));
app.use('/api/v1/certificates', require('./routes/certificates'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/messages', require('./routes/messages'));
app.use('/api/v1/admin', require('./routes/admin'));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const { verifyAccessToken } = require('./utils/generateToken');
    const decoded = verifyAccessToken(token);
    const User = require('./models/User');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('User not found'));
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user?.name}`);

  socket.join(`user:${socket.user._id}`);

  socket.on('join-course', (courseId) => {
    socket.join(`course:${courseId}`);
  });

  socket.on('leave-course', (courseId) => {
    socket.leave(`course:${courseId}`);
  });

  socket.on('send-message', async (data) => {
    const Message = require('./models/Message');
    try {
      const message = await Message.create({
        sender: socket.user._id,
        receiver: data.receiver,
        course: data.course,
        content: data.content,
      });
      const populated = await Message.findById(message._id)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');
      io.to(`user:${data.receiver}`).emit('new-message', populated);
      socket.emit('message-sent', populated);
    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (data) => {
    socket.to(`user:${data.receiver}`).emit('user-typing', {
      userId: socket.user._id,
      name: socket.user.name,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user?.name}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
