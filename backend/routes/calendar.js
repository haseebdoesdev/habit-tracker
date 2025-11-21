const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/auth');

// TODO: Define POST /sync route
// WHY: Sync with Google Calendar
router.post('/sync', auth, calendarController.syncCalendar);

module.exports = router;
