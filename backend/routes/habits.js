const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const auth = require('../middleware/auth');

// TODO: Apply auth middleware to all routes
// WHY: Only logged-in users can access habits

// TODO: Define POST / route
// WHY: Create a new habit
router.post('/', auth, habitController.createHabit);

// TODO: Define GET / route
// WHY: Get all habits for user
router.get('/', auth, habitController.getHabits);

// TODO: Define PUT /:id route
// WHY: Update a specific habit
router.put('/:id', auth, habitController.updateHabit);

// TODO: Define DELETE /:id route
// WHY: Delete a specific habit
router.delete('/:id', auth, habitController.deleteHabit);

module.exports = router;
