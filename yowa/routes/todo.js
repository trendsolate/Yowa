const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos?owner=alice
router.get('/', async (req, res) => {
  const filter = req.query.owner ? { owner: req.query.owner } : {};
  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos
router.post('/', async (req, res) => {
  const { text, owner, priority, due } = req.body;
  const todo = await Todo.create({ text, owner, priority, due });
  res.status(201).json(todo);
});

// PATCH /api/todos/:id - toggle done or edit fields
router.patch('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;