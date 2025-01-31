const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json()); // Middleware to parse JSON

let tasks = [];
let currentId = 1;

// Get all tasks
app.get('/tasks', (req, res) => {
  try {
    console.log('Fetching all tasks:', tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    console.log('Fetching task with ID:', taskId);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new task
app.post('/tasks', (req, res) => {
  try {
    console.log('POST Request Body:', req.body); // Debug log

    const { title, description, dueDate, status } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !status) {
      return res.status(400).json({
        error: 'Missing required fields: title, description, dueDate, or status',
      });
    }

    const newTask = {
      id: currentId++,
      title,
      description,
      dueDate,
      status,
    };

    tasks.push(newTask);
    console.log('Task created:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, dueDate, status } = req.body;

    // Find the task by ID
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task fields only if provided
    const updatedTask = {
      ...tasks[taskIndex],
      title: title ?? tasks[taskIndex].title,
      description: description ?? tasks[taskIndex].description,
      dueDate: dueDate ?? tasks[taskIndex].dueDate,
      status: status ?? tasks[taskIndex].status,
    };

    tasks[taskIndex] = updatedTask;
    console.log('Task updated:', updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    console.log(`Task with ID ${taskId} deleted`);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});