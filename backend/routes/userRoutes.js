const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new user
router.post('/create', userController.createUser);

router.get('/:userId', userController.getUserById);

module.exports = router;