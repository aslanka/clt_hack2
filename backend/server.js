    // server.js
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    require('dotenv').config();

    // Initialize the app
    const app = express();

    // Set the port from environment variable or default to 3000
    const PORT = 3000;

    const JWT_SECRET = 'your_jwt_secret_key';


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