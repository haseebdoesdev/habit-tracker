const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');

// TODO: Define POST / route
// WHY: Log a habit completion
router.post('/', auth, logController.logHabit);

// TODO: Define GET / route
// WHY: Get logs history
router.get('/', auth, logController.getLogs);

module.exports = router;
