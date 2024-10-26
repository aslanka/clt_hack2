const db = require('../config/db');

const Friendship = {
    addFriend: (userId, friendId, callback) => {
        const query = 'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, "pending")';
        db.query(query, [userId, friendId], callback);
    }
};

module.exports = Friendship;
