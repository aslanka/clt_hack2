// controllers/activityController.js
const Activity = require('../models/Activity');

// Controller to add a new activity
const addActivity = (req, res) => {
    const { activity_name, description, points } = req.body;
    Activity.add(activity_name, description, points, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add activity' });
        }
        res.status(201).json({ message: 'Activity added successfully' });
    });
};

// Controller to get all activities
const getAllActivities = (req, res) => {
    Activity.getAll((err, activities) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve activities' });
        }
        res.status(200).json(activities);
    });
};

// Controller to get an activity by ID
const getActivityById = (req, res) => {
    const { activity_id } = req.params;
    Activity.findById(activity_id, (err, activity) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve activity' });
        }
        if (!activity.length) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(200).json(activity[0]);
    });
};

// Controller to update an activity by ID
const updateActivity = (req, res) => {
    const { activity_id } = req.params;
    const { activity_name, description, points } = req.body;
    Activity.update(activity_id, activity_name, description, points, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update activity' });
        }
        res.status(200).json({ message: 'Activity updated successfully' });
    });
};

// Controller to delete an activity by ID
const deleteActivity = (req, res) => {
    const { activity_id } = req.params;
    Activity.delete(activity_id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete activity' });
        }
        res.status(200).json({ message: 'Activity deleted successfully' });
    });
};

module.exports = {
    addActivity,
    getAllActivities,
    getActivityById,
    updateActivity,
    deleteActivity
};
