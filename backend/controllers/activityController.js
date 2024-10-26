const Activity = require('../models/Activity');

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

module.exports = {
    addActivity
};