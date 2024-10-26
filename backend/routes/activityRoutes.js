const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Route to add a new activity
router.post('/add', activityController.addActivity);

module.exports = router;
