const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    // TODO: Define Achievement schema fields
    // - user (ObjectId, ref: 'User')
    // - title (String, required)
    // - description (String)
    // - icon (String)
    // - dateEarned (Date, default: Date.now)
    // WHY: Gamification element to reward users
});

module.exports = mongoose.model('Achievement', AchievementSchema);
