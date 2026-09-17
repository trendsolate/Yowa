const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: String, required: true }, // username or user id of the peerson thaht sent it
    text: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);