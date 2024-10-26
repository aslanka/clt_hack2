const db = require('../config/db');

const Rewards = {
    // Method to add a new reward
    addReward: (points, reward, callback) => {
        const query = 'INSERT INTO Rewards (points, reward) VALUES (?, ?)';
        db.query(query, [points, reward], callback);
    },

    // Method to find an exact reward match by points and reward
    findExactReward: (points, reward, callback) => {
        const query = 'SELECT * FROM Rewards WHERE points = ? AND reward = ?';
        db.query(query, [points, reward], callback);
    },

    // Method to get a reward by points
    getRewardByPoints: (points, callback) => {
        const query = 'SELECT * FROM Rewards WHERE points = ?';
        db.query(query, [points], callback);
    },

    // Method to retrieve all rewards
    getAllRewards: (callback) => {
        const query = 'SELECT * FROM Rewards';
        db.query(query, callback);
    },

    // Method to delete a reward by points
    deleteReward: (points, callback) => {
        const query = 'DELETE FROM Rewards WHERE points = ?';
        db.query(query, [points], callback);
    }
};

module.exports = Rewards;
