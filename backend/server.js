<<<<<<< HEAD
// server.js
const express = require('express');
const db = require('./config/db'); // Import database connection
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
require('dotenv').config();
=======
    // server.js
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
>>>>>>> main

    // Initialize the app
    const app = express();

<<<<<<< HEAD
// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;
=======
    // Set the port from environment variable or default to 3000
    const PORT = 3000;
>>>>>>> main

    const JWT_SECRET = 'your_jwt_secret_key';

<<<<<<< HEAD
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
=======

    // Middleware to parse JSON requests
    app.use(express.json());

    app.use(cors());
    app.use(bodyParser.json());

    function verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).send('Unauthorized: No token provided');
        }
      
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).send('Unauthorized: No token provided');
        }
      
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
          }
          req.userId = decoded.userId; // Attach decoded user ID to the request
          next();
        });
      }

      app.post('/login', (req, res) => {
        const { username, password } = req.body;
        // const user = users.find(
        //   (u) => u.username === username && u.password === password
        // );
      
        if (true) {
          const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      });
>>>>>>> main
