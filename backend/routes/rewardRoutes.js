const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');

router.post('/add', rewardsController.addReward);
router.get('/rewards/:points', rewardsController.getRewardByPoints);
router.get('/all', rewardsController.getAllRewards);
router.delete('/delete', rewardsController.deleteReward);

module.exports = router;