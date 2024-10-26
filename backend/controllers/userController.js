const User = require('../models/User');

const createUser = (req, res) => {
    const { username, email, passwordHash, profileUri  } = req.body;
    User.create(username, email, passwordHash, profileUri, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
};

// No changes needed for getUserById as it retrieves all fields, including profile_uri
const getUserById = (req, res) => {
    const userId = req.params.userId;
    User.findById(userId, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve user' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    });
};

module.exports = {
    createUser,
    getUserById,
};
