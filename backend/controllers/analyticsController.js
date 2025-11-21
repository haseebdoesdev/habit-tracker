const Habit = require('../models/Habit');
const Log = require('../models/Log');

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all logs for the user
        const logs = await Log.find({ user: userId });
        const totalLogged = logs.length;
        const totalCompleted = logs.filter(log => log.status === 'completed').length;

        let completionRate = 0;
        if (totalLogged > 0) {
            completionRate = (totalCompleted / totalLogged) * 100;
        }

        // Get all habits for the user to show streaks
        const habits = await Habit.find({ user: userId }).select('title streak');

        res.status(200).json({
            completionRate: completionRate.toFixed(2),
            totalCompleted,
            totalLogged,
            habits
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
