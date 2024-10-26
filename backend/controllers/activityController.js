const User = require('../models/User');

// Controller method to create a new user
const createUser = (req, res) => {
    const { username, email, password } = req.body;
    const passwordHash = hashPassword(password); // Assume you have a function to hash the password

    User.create(username, email, passwordHash, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
};

// Controller method to find a user by ID
const getUserById = (req, res) => {
    const { userId } = req.params;

    User.findById(userId, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve user' });
        }
        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user[0]);
    });
};

// Controller method to retrieve all users
const getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve users' });
        }
        res.status(200).json(users);
    });
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers
};
