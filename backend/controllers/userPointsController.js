const UserPoints = require('../models/UserPoints');

// Add points for a user
const addPoints = (req, res) => {
    const { user_id, activity_id, points } = req.body;
    UserPoints.addPoints(user_id, activity_id, points, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add points' });
        res.status(201).json({ message: 'Points added successfully' });
    });
};

// Get points by user ID
const getPointsByUserId = (req, res) => {
    const { user_id } = req.params;
    UserPoints.getByUserId(user_id, (err, points) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve points' });
        res.status(200).json(points);
    });
};

// Update points for a user and activity
const updatePoints = (req, res) => {
    const { user_id, activity_id, points } = req.body;
    UserPoints.updatePoints(user_id, activity_id, points, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update points' });
        res.status(200).json({ message: 'Points updated successfully' });
    });
};

// Delete points for a user and activity
const deletePoints = (req, res) => {
    const { user_id, activity_id } = req.body;
    UserPoints.deletePoints(user_id, activity_id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete points' });
        res.status(200).json({ message: 'Points deleted successfully' });
    });
};

module.exports = {
    addPoints,
    getPointsByUserId,
    updatePoints,
    deletePoints
};
