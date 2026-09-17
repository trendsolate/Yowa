const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// GET /api/conversations - list all conversations
router.get('/', async (req, res) => {
  const conversations = await Conversation.find().sort({ updatedAt: -1 });
  res.json(conversations);
});

// POST /api/conversations - create a conversation
router.post('/', async (req, res) => {
  const { name, color, participants } = req.body;
  const conversation = await Conversation.create({ name, color, participants });
  res.status(201).json(conversation);
});

// GET /api/conversations/:id/messages - list messages in a conversation
router.get('/:id/messages', async (req, res) => {
  const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });
  res.json(messages);
});

// POST /api/conversations/:id/messages - send a message
router.post('/:id/messages', async (req, res) => {
  const { sender, text } = req.body;
  const message = await Message.create({ conversation: req.params.id, sender, text });
  await Conversation.findByIdAndUpdate(req.params.id, { updatedAt: new Date() });

  // broadcast over websocket if available
  const io = req.app.get('io');
  if (io) io.to(req.params.id).emit('message:new', message);

  res.status(201).json(message);
});

module.exports = router;