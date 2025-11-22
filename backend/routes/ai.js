const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// TODO: Define POST /suggestions route
// WHY: Get AI habit suggestions
router.post('/suggestions', auth, aiController.getHabitSuggestions);

// TODO: Define GET /summary route
// WHY: Get weekly AI summary
router.get('/summary', auth, aiController.getWeeklySummary);

module.exports = router;
