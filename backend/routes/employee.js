const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All employee routes require auth
router.use(protect);

// @route   GET /api/employee/tasks
// @desc    Get tasks assigned to the logged-in employee
router.get('/tasks', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { assignedTo: req.user._id };
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/employee/tasks/:id/status
// @desc    Update status of own task
router.patch('/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user._id },
      { status },
      { new: true }
    ).populate('assignedBy', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not assigned to you' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/employee/stats
// @desc    Get task stats for the logged-in employee
router.get('/stats', async (req, res) => {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ assignedTo: req.user._id }),
      Task.countDocuments({ assignedTo: req.user._id, status: 'Pending' }),
      Task.countDocuments({ assignedTo: req.user._id, status: 'In Progress' }),
      Task.countDocuments({ assignedTo: req.user._id, status: 'Completed' }),
    ]);
    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
