const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Route to add a new activity
router.post('/add', activityController.addActivity);

// Route to get all activities
router.get('/all', activityController.getAllActivities);

// Route to get an activity by ID
router.get('/:activity_id', activityController.getActivityById);

// Route to update an activity by ID
router.put('/:activity_id', activityController.updateActivity);

// Route to delete an activity by ID
router.delete('/:activity_id', activityController.deleteActivity);

module.exports = router;
