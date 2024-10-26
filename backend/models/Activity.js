const db = require('../config/db'); // Import the reusable database connection

const Activity = {
    add: (activity_name, description, points, callback) => {
        const query = 'INSERT INTO Activities (activity_name, description, points) VALUES (?, ?, ?)';
        db.query(query, [activity_name, description, points], (err, result) => {
            if (typeof callback === 'function') {
                callback(err, result);
            }
        });
    },

    getAll: (callback) => {
        const query = 'SELECT * FROM Activities';
        db.query(query, (err, results) => {
            if (typeof callback === 'function') {
                callback(err, results);
            }
        });
    }
};

module.exports = Activity;