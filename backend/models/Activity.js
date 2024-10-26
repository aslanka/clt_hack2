const db = require('../config/db'); // Import the reusable database connection

const Activity = {
    add: (userId, activityType, description, points, callback) => {
        const query = 'INSERT INTO activities (user_id, activity_type, description, points) VALUES (?, ?, ?, ?)';
        db.query(query, [userId, activityType, description, points], callback);
    },

    // Example of another method to retrieve all activities for a user
    getAllByUser: (userId, callback) => {
        const query = 'SELECT * FROM activities WHERE user_id = ?';
        db.query(query, [userId], callback);
    }
};

module.exports = Activity;
