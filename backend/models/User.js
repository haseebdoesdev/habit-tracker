const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // TODO: Define User schema with fields:
    // - email (String, required, unique, lowercase, trim)
    // - password (String, required, minlength: 6)
    // - name (String, required)
    // - xp (Number, default: 0)
    // - level (Number, default: 1)
    // - badges (Array of Objects: {name, earnedAt})
    // - googleCalendarToken (String, optional - for calendar sync)
    // - createdAt (Date, default: Date.now)
    // WHY: Structure the user data for consistency and validation
});

// TODO: Add pre-save hook to hash password with bcrypt
// WHY: Never store plain text passwords - security best practice!
// HINT: Use bcrypt.hash() with salt rounds = 10
// SECURITY: Hashing ensures that even if the DB is compromised, passwords remain secure

module.exports = mongoose.model('User', UserSchema);
