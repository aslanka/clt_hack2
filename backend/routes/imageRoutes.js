const express = require('express');
const router = express.Router();
const multer = require('multer');
const image = require('../models/Image');

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route to validate an image
router.post('/validate', upload.single('image'), image.validateImage);

module.exports = router;
