const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    owner: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    due: { type: String, default: '' }, // 'YYYY-MM-DD'
    done: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);