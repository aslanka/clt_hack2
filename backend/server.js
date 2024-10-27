require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const fs = require("fs/promises");
const AWS = require('aws-sdk');

// Import database connection and routes
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const userPointsRoutes = require('./routes/userPointsRoutes');
const chatRoutes = require("./routes/chatRoutes");

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// AWS configuration using environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const params = {
  Bucket: process.env.AWS_S3_BUCKET,
  Key: process.env.AWS_S3_FILE_KEY,
  Expires: 60, // Expiration time in seconds
};

const signedUrl = s3.getSignedUrl('getObject', params);

console.log(signedUrl);

// Initialize the app
const app = express();

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Google Generative AI setup using environment variables
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const geminiConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: process.env.GOOGLE_AI_MODEL_NAME,
  geminiConfig,
});

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/activities', activityRoutes);
app.use('/rewards', rewardRoutes);
app.use('/userPoints', userPointsRoutes);
app.use("/api", chatRoutes);


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
    req.userId = decoded.userId;
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
      const newUser = { username, full_name, academic_year, email, password_hashed: hashedPassword, profile_uri };
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
      res.json({ token, userId: user.user_id });
    });
  });
});

app.post('/image', upload.single('image'), async (req, res) => {
  try {
    // Ensure the file and description are provided
    if (!req.file || !req.body.description) {
      return res.status(400).json({ error: 'Image file and description are required' });
    }

    const description = req.body.description;

    // Read the uploaded image file
    const imageFile = await fs.readFile(req.file.path);
    const imageBase64 = imageFile.toString("base64");

    console.log('File received:', req.file); 
    console.log('Activity description:', description);

    const promptConfig = [
      { text: `Analyze this image based on the activity description: "${description}". Print 1 if the item in the image is recyclable, 0 if not, or if unsure.` },
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageBase64,
        },
      },
    ];

    // Generate content using Google Generative AI
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });

    const response = await result.response;
    console.log(response.text());

    // Clean up: delete the temporary file after processing
    await fs.unlink(req.file.path);

    // Return the response
    res.json({ description: parseInt(response.text().trim(), 10) });
  } catch (error) {
    console.log(" response error", error);
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
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

app.get('/totalpoints/:userId', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
