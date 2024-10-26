// server.js
const express = require('express');
const db = require('./config/db'); // Import database connection
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
require('dotenv').config();

// Initialize the app
const app = express();

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example route
app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the single-file server!' });
});

// Define routes for each feature
app.use('/users', userRoutes);
app.use('/activities', activityRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
