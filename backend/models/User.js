const db = require('../config/db'); // Import the database connection

const User = {
    // Method to create a new user
    create: (username, email, passwordHash, callback) => {
        const query = 'INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)';
        db.query(query, [username, email, passwordHash], callback);
    },

    // Method to find a user by their ID
    findById: (userId, callback) => {
        const query = 'SELECT * FROM User WHERE user_id = ?';
        db.query(query, [userId], callback);
    },

    // Method to retrieve all users (optional)
    getAll: (callback) => {
        const query = 'SELECT * FROM User';
        db.query(query, callback);
    }
};

module.exports = User;
