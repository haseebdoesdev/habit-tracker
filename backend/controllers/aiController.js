const geminiHelper = require('../utils/geminiHelper');
const Log = require('../models/Log');

exports.getHabitSuggestions = async (req, res) => {
    try {
        const { goals } = req.body;
        if (!goals) {
            return res.status(400).json({ message: 'Goals are required' });
        }

        const suggestions = await geminiHelper.suggestHabits(goals);
        // Clean up the response if it contains markdown code blocks
        const cleanSuggestions = suggestions.replace(/```json/g, '').replace(/```/g, '').trim();

        res.status(200).json(JSON.parse(cleanSuggestions));
    } catch (error) {
        console.error('Error getting habit suggestions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getWeeklySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get logs for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = await Log.find({
            user: userId,
            date: { $gte: sevenDaysAgo }
        }).populate('habit', 'name');

        if (logs.length === 0) {
            return res.status(200).json({ message: 'No logs found for the week', analysis: 'Start tracking your habits to get insights!' });
        }

        const habitData = logs.map(log => ({
            habit: log.habit.name,
            status: log.status,
            date: log.date
        }));

        const analysis = await geminiHelper.analyzeHabits(habitData);
        res.status(200).json({ analysis });
    } catch (error) {
        console.error('Error getting weekly summary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
