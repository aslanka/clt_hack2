const db = require('../config/db');

const Leaderboard = {
    // Function to retrieve the top users based on their total points
    getTop: (limit, callback) => {
        const query = `
            SELECT user_id, total_points 
            FROM leaderboards 
            ORDER BY total_points DESC 
            LIMIT ?
        `;
        db.query(query, [limit], callback);
    },
    
    // Additional model methods for leaderboard (e.g., updating points) could be added here
};

module.exports = Leaderboard;
