const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const auth = require('../middleware/auth');

router.post('/', auth, habitController.createHabit);
router.get('/', auth, habitController.getHabits);
router.put('/:id', auth, habitController.updateHabit);
router.delete('/:id', auth, habitController.deleteHabit);

module.exports = router;
