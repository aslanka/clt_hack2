const User = require('../models/User');

const createUser = (req, res) => {
    const { username, email, passwordHash } = req.body;
    User.create(username, email, passwordHash, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
};

module.exports = {
    createUser
};
