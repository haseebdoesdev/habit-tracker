const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // TODO: Get token from header
    // WHY: Client sends token in 'x-auth-token' or 'Authorization' header to prove identity

    // TODO: Check if not token
    // WHY: If no token is present, deny access immediately

    try {
        // TODO: Verify token
        // WHY: Ensure token is valid and not expired
        // HINT: Use jwt.verify()

        // TODO: Set req.user
        // WHY: Make user data available to protected routes

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
