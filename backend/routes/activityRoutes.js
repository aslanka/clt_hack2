const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const verifyToken = require('../server'); // Adjust the path as needed

// Protected route to add a new activity
router.post('/add', verifyToken, activityController.addActivity);

// Public route to get all activities
router.get('/all', activityController.getAllActivities);

// Protected routes
router.get('/:activity_id', verifyToken, activityController.getActivityById);
router.put('/:activity_id', verifyToken, activityController.updateActivity);
router.delete('/:activity_id', verifyToken, activityController.deleteActivity);

module.exports = router;
