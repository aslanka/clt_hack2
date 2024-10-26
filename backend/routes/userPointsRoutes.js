const express = require('express');
const router = express.Router();
const userPointsController = require('../controllers/userPointsController');

router.post('/add', userPointsController.addPoints);
router.get('/:user_id', userPointsController.getPointsByUserId);
router.put('/update', userPointsController.updatePoints);
router.delete('/delete', userPointsController.deletePoints);

module.exports = router;