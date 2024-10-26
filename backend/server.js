    // server.js
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');

    const db = require('./config/db'); // Import database connection
    const userRoutes = require('./routes/userRoutes');
    const activityRoutes = require('./routes/activityRoutes');
    const rewardRoutes = require('./routes/rewardRoutes');
    const userPointsRoutes = require('./routes/userPointsRoutes');
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
    app.use('/activities', activityRoutes); 
    app.use('/rewards', rewardRoutes); 
    app.use('/userPoints', userPointsRoutes);
  

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


      app.post('/signup', (req, res) => {
        const { username, full_name, academic_year, email, password, profile_uri } = req.body;
      
        // Check if the user already exists
        db.query('SELECT * FROM User WHERE username = ?', [username], (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
      
          if (results.length > 0) {
            // User already exists
            return res.status(409).json({ message: 'Username already taken' });
          }
      
          // Hash the password before storing it
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              console.error('Error hashing password:', err);
              return res.status(500).json({ message: 'Internal server error' });
            }
      
            // Insert the new user into the database
            const newUser = { username, full_name, academic_year, email, password_hashed: hashedPassword , profile_uri};
            db.query('INSERT INTO User SET ?', newUser, (err, results) => {
              if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Internal server error' });
              }
      
              // Optionally, generate a token for the new user
              const token = jwt.sign({ userId: results.insertId }, JWT_SECRET, { expiresIn: '10s' });
      
              res.status(201).json({ token });
            });
          });
        });
      });
      










      app.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Query to find the user by username
        db.query('SELECT * FROM User WHERE username = ?', [username], (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
      
          if (results.length === 0) {
            // User not found
            return res.status(401).json({ message: 'Invalid credentials' });
          }
      
          const user = results[0];
      
          // Compare the provided password with the hashed password in the database
          bcrypt.compare(password, user.password_hashed, (err, isMatch) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              return res.status(500).json({ message: 'Internal server error' });
            }
      
            if (!isMatch) {
              // Invalid password
              return res.status(401).json({ message: 'Invalid credentials' });
            }
      
            // Generate JWT token if credentials are valid
            const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '10s' });
            console.log(user.user_id)
            res.json({ token, userId: user.user_id });
          });
        });
      });

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});