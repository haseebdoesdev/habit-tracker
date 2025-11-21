const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        // TODO: Destructure name, email, password from req.body
        // WHY: Extract user input for processing

        // TODO: Check if user already exists
        // WHY: Prevent duplicate accounts with the same email

        // TODO: Create new User instance
        // WHY: Prepare data for saving

        // TODO: Save user to database
        // WHY: Persist user data
        // HINT: Password hashing is handled in the User model pre-save hook

        // TODO: Create JWT payload
        // WHY: Prepare data to be encoded in the token

        // TODO: Sign and return JWT token
        // WHY: Allow user to authenticate immediately after registration

        res.status(201).json({ message: 'Register user - to be implemented' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    try {
        // TODO: Destructure email, password from req.body

        // TODO: Find user by email
        // WHY: Check if the account exists

        // TODO: Check if password matches
        // WHY: Verify credentials
        // HINT: Use bcrypt.compare()

        // TODO: Return JWT token
        // WHY: Grant access to protected routes

        res.status(200).json({ message: 'Login user - to be implemented' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.logoutUser = (req, res) => {
    // TODO: Handle logout (client-side usually clears token, but server can blacklist if needed)
    // WHY: End the session
    res.status(200).json({ message: 'Logout - handled on client side usually' });
};
