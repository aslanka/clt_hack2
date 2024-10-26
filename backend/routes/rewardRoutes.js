const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');

router.post('/rewards', rewardsController.addReward);
router.get('/rewards/:points', rewardsController.getRewardByPoints);
router.get('/rewards', rewardsController.getAllRewards);
router.delete('/rewards', rewardsController.deleteReward);

module.exports = router;
