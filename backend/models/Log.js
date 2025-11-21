const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    // TODO: Define Log schema fields
    // - user (ObjectId, ref: 'User')
    // - habit (ObjectId, ref: 'Habit')
    // - date (Date, required)
    // - status (String, enum: ['completed', 'skipped', 'failed'], default: 'completed')
    // - notes (String)
    // WHY: Keep a separate log for analytics and history tracking
});

module.exports = mongoose.model('Log', LogSchema);
