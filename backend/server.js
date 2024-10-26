// server.js
const express = require('express');
require('dotenv').config();

// Initialize the app
const app = express();

// Set the port from environment variable or default to 3000
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example route
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from the single-file server!' });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
