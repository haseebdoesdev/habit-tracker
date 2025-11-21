const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// TODO: Define POST /register route
// WHY: Endpoint for new user registration
router.post('/register', authController.registerUser);

// TODO: Define POST /login route
// WHY: Endpoint for user authentication
router.post('/login', authController.loginUser);

// TODO: Define GET /user route (protected)
// WHY: Get current user data
router.get('/user', auth, (req, res) => {
    // TODO: Return user data (excluding password)
    res.send('User data placeholder');
});

module.exports = router;
