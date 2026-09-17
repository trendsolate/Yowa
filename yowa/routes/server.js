require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const conversationRoutes = require('./routes/conversations');
const habitRoutes = require('./routes/habits');
const todoRoutes = require('./routes/todos');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
});

app.set('io', io);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/conversations', conversationRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/todos', todoRoutes);

io.on('connection', (socket) => {
  socket.on('conversation:join', (conversationId) => {
    socket.join(conversationId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`YOWA API listening on port ${PORT}`));