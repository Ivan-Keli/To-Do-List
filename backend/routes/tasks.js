const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  reorderTasks
} = require('../controllers/taskController');

// GET /api/tasks - Get all tasks with optional filtering
router.get('/', getAllTasks);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

// PATCH /api/tasks/:id/complete - Toggle task completion status
router.patch('/:id/complete', toggleTaskComplete);

// PATCH /api/tasks/reorder - Reorder tasks (for drag & drop)
router.patch('/reorder', reorderTasks);

module.exports = router;
