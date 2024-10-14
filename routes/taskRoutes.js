const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create a schema and model for the tasks
const taskSchema = new mongoose.Schema({
    name: String
});

const Task = mongoose.model('Task', taskSchema);

// Route to get all tasks (GET request)
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Route to add a new task (POST request)
router.post('/', async (req, res) => {
    const newTask = new Task({ name: req.body.name });
    await newTask.save();
    res.json(newTask);
});

// Route to delete all tasks (DELETE request)
router.delete('/', async (req, res) => {
    await Task.deleteMany({});
    res.json({ message: 'All tasks deleted' });
});

// Route to delete selected tasks (DELETE request)
router.delete('/deleteSelected', async (req, res) => {
    const taskNames = req.body.tasks;
    await Task.deleteMany({ name: { $in: taskNames } });
    res.json({ message: 'Selected tasks deleted' });
});

module.exports = router;
