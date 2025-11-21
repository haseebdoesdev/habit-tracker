const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    // TODO: Define Habit schema fields
    // - user (ObjectId, ref: 'User', required) -> Link to the user who owns this habit
    // - title (String, required)
    // - description (String)
    // - frequency (String, enum: ['daily', 'weekly'], default: 'daily')
    // - targetDays (Array of Strings, e.g., ['Mon', 'Wed'] for weekly)
    // - streak (Number, default: 0)
    // - completedDates (Array of Date)
    // - createdAt (Date, default: Date.now)
    // WHY: Define the structure of a habit to track progress
});

module.exports = mongoose.model('Habit', HabitSchema);
