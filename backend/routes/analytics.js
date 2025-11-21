const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// TODO: Define GET / route
// WHY: Get overall analytics data (completion rate, total logs, habit streaks)
router.get('/', auth, analyticsController.getAnalytics);

// TODO: Define GET /weekly route
// WHY: Get weekly analytics breakdown with daily completion trends
router.get('/weekly', auth, analyticsController.getWeeklyAnalytics);

// TODO: Define GET /monthly route
// WHY: Get monthly analytics with habit performance comparison
router.get('/monthly', auth, analyticsController.getMonthlyAnalytics);

// TODO: Define GET /habit/:habitId route
// WHY: Get analytics for a specific habit (completion rate, streak history)
router.get('/habit/:habitId', auth, analyticsController.getHabitAnalytics);

// TODO: Define GET /trends route
// WHY: Get trend analysis (improving/declining habits, peak performance periods)
router.get('/trends', auth, analyticsController.getTrends);

module.exports = router;
