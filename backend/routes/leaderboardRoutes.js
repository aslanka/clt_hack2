const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Route to get the leaderboard
router.get('/', leaderboardController.getLeaderboard);

module.exports = router;
