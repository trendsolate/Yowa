const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: '#6B4423' },
    participants: [{ type: String }] // usernames or user ids
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);