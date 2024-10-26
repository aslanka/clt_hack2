const Leaderboard = require('../models/Leaderboard');

// Controller function to get the top users on the leaderboard
const getLeaderboard = (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default to top 10 if no limit is specified

    Leaderboard.getTop(limit, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve leaderboard' });
        }
        res.json(results);
    });
};

// Additional controller functions for leaderboard-related operations could be added here

module.exports = {
    getLeaderboard
};
