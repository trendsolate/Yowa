const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true }, // username or user id
    completedDates: [{ type: String }] // 'YYYY-MM-DD' strings
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);