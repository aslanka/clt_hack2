const db = require('../config/db');

const UserPoints = {
    // Add points for a specific user and activity
    addPoints: (user_id, activity_id, points, callback) => {
        const query = 'INSERT INTO User_Points (user_id, activity_id, points) VALUES (?, ?, ?)';
        db.query(query, [user_id, activity_id, points], callback);
    },

    // Get all points for a specific user
    getPointsByUserId: (user_id, callback) => {
        const query = 'SELECT * FROM User_Points WHERE user_id = ?';
        db.query(query, [user_id], callback);
    },

    // Update points for a specific user and activity
    updatePoints: (user_id, activity_id, points, callback) => {
        const query = 'UPDATE User_Points SET points = ? WHERE user_id = ? AND activity_id = ?';
        db.query(query, [points, user_id, activity_id], callback);
    },

    // Delete points record for a user and activity
    deletePoints: (user_id, activity_id, callback) => {
        const query = 'DELETE FROM User_Points WHERE user_id = ? AND activity_id = ?';
        db.query(query, [user_id, activity_id], callback);
    }
};

module.exports = UserPoints;
