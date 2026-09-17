const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// GET /api/habits?owner=alice
router.get('/', async (req, res) => {
  const filter = req.query.owner ? { owner: req.query.owner } : {};
  const habits = await Habit.find(filter).sort({ createdAt: 1 });
  res.json(habits);
});

// POST /api/habits
router.post('/', async (req, res) => {
  const { name, owner } = req.body;
  const habit = await Habit.create({ name, owner, completedDates: [] });
  res.status(201).json(habit);
});

// PATCH /api/habits/:id/toggle - toggle a single day, body: { date: 'YYYY-MM-DD' }
router.patch('/:id/toggle', async (req, res) => {
  const { date } = req.body;
  const habit = await Habit.findById(req.params.id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  const idx = habit.completedDates.indexOf(date);
  if (idx >= 0) habit.completedDates.splice(idx, 1);
  else habit.completedDates.push(date);

  await habit.save();
  res.json(habit);
});

// DELETE /api/habits/:id
router.delete('/:id', async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;