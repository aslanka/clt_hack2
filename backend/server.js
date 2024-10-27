    // server.js
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const mysql = require('mysql2'); 

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
            const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '10hr' });
            console.log(user.user_id)
            res.json({ token, userId: user.user_id });
          });
        });
      });

      app.get('/totalpoints/:userId',  (req, res) => {
        const userId = req.params.userId; // Get the user ID from the request parameters
        const query = `
            SELECT u.user_id, 
                   u.username, 
                   u.full_name, 
                   SUM(ap.points) AS total_points
            FROM User u
            JOIN User_Points ap ON u.user_id = ap.user_id
            WHERE u.user_id = ?
            GROUP BY u.user_id, u.username, u.full_name;
        `;
    
        // Execute the query
        db.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Error fetching user points:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' }); // Handle case where user is not found
            }
    
            // Send the results as a JSON response
            const totalPoints = parseInt(results[0].total_points, 10);
            res.json(totalPoints); // Send the first (and only) result as the response
        });
    });
    

      app.get('/leaderboard', (req, res) => {
        const query = `
            SELECT u.user_id, 
                   u.username, 
                   u.full_name, 
                   SUM(ap.points) AS total_points
            FROM User u
            JOIN User_Points ap ON u.user_id = ap.user_id
            GROUP BY u.user_id, u.username, u.full_name
            ORDER BY total_points DESC
            LIMIT 5;
        `;
    
        // Execute the query
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching leaderboard:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Send the results as a JSON response
            res.json(results);
        });
    });

    app.get('/recent-activities', (req, res) => {
      const query = `
        SELECT u.user_id, u.username, u.profile_uri, up.activity_id, up.points, up.completed_at
        FROM User_Points up
        JOIN User u ON up.user_id = u.user_id
        ORDER BY up.completed_at DESC
        LIMIT 10;  -- adjust the limit as needed
      `;
    
      db.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query error' });
        }
    
        // Format the response
        const activities = results.map(activity => ({
          userId: activity.user_id,
          username: activity.username,
          profileImage: activity.profile_uri,
          activityId: activity.activity_id,
          points: activity.points,
          completedAt: activity.completed_at,
        }));
    
        res.json(activities);
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