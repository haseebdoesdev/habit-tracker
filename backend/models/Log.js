const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'skipped', 'failed'],
        default: 'completed'
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Log', LogSchema);
