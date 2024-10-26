const express = require('express');
const router = express.Router();
const userPointsController = require('../controllers/userPointsController');

router.post('/userpoints', userPointsController.addPoints);
router.get('/userpoints/:user_id', userPointsController.getPointsByUserId);
router.put('/userpoints', userPointsController.updatePoints);
router.delete('/userpoints', userPointsController.deletePoints);

module.exports = router;
