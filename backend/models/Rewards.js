const db = require('../config/db');

const Rewards = {
    // Add a new reward
    addReward: (points, reward, callback) => {
        const query = 'INSERT INTO Rewards (points, reward) VALUES (?, ?)';
        db.query(query, [points, reward], callback);
    },

    // Get a reward by points
    getRewardByPoints: (points, callback) => {
        const query = 'SELECT * FROM Rewards WHERE points = ?';
        db.query(query, [points], callback);
    },

    // Retrieve all rewards
    getAllRewards: (callback) => {
        const query = 'SELECT * FROM Rewards';
        db.query(query, callback);
    },

    // Delete a reward
    deleteReward: (points, callback) => {
        const query = 'DELETE FROM Rewards WHERE points = ?';
        db.query(query, [points], callback);
    }
};

module.exports = Rewards;
