const db = require('../config/db'); // Import the reusable database connection

const Activity = {
    // Method to add a new activity
    add: (activity_name, description, points, callback) => {
        const query = 'INSERT INTO Activities (activity_name, description, points) VALUES (?, ?, ?)';
        db.query(query, [activity_name, description, points], callback);
    },

    // Method to retrieve all activities
    getAll: (callback) => {
        const query = 'SELECT * FROM Activities';
        db.query(query, callback);
    },

    // Method to retrieve an activity by its ID
    findById: (activity_id, callback) => {
        const query = 'SELECT * FROM Activities WHERE activity_id = ?';
        db.query(query, [activity_id], callback);
    },

    // Method to update an activity's details
    update: (activity_id, activity_name, description, points, callback) => {
        const query = 'UPDATE Activities SET activity_name = ?, description = ?, points = ? WHERE activity_id = ?';
        db.query(query, [activity_name, description, points, activity_id], callback);
    },

    // Method to delete an activity by its ID
    delete: (activity_id, callback) => {
        const query = 'DELETE FROM Activities WHERE activity_id = ?';
        db.query(query, [activity_id], callback);
    }
};

module.exports = Activity;
