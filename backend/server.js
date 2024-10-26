    // server.js
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    const db = require('./config/db'); // Import database connection
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
    require('dotenv').config();

    // Initialize the app
    const app = express();

    // Set the port from environment variable or default to 3000
    const PORT = 3000;

    const JWT_SECRET = 'your_jwt_secret_key';
    const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';


    // Middleware to parse JSON requests
    app.use(express.json());

    app.use(cors());
    app.use(bodyParser.json());
    app.use('/users', userRoutes);
    app.use('/activities', verifyToken, activityRoutes); 
    app.use('/leaderboard', leaderboardRoutes);

    function verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        console.log(authHeader)
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
          // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
          const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '10s' });


          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      });
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    // Admin login route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the credentials match the hardcoded admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ userId: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } else {
      res.status(401).json({ message: 'Invalid credentials' });
  }
});