const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/employees
// @desc    Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/admin/employees/:id/approve
// @desc    Approve an employee login
router.patch('/employees/:id/approve', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'employee' },
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: `${user.name} has been approved`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/admin/employees/:id/revoke
// @desc    Revoke an employee's access
router.patch('/employees/:id/revoke', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'employee' },
      { isApproved: false },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: `${user.name}'s access has been revoked`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/tasks
// @desc    Assign a task to an employee
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and assignee are required' });
    }

    const employee = await User.findOne({ _id: assignedTo, role: 'employee', isApproved: true });
    if (!employee) return res.status(404).json({ message: 'Approved employee not found' });

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
    });

    const populated = await task.populate('assignedTo', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/tasks
// @desc    Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/tasks/:id
// @desc    Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalEmployees, pendingApproval, totalTasks, taskStats] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      User.countDocuments({ role: 'employee', isApproved: false }),
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const stats = { totalEmployees, pendingApproval, totalTasks };
    taskStats.forEach((s) => { stats[s._id.replace(' ', '')] = s.count; });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
