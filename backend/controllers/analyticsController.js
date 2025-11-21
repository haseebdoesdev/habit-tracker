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

exports.getWeeklyAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Calculate date range for the last 7 days
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 6);
        weekAgo.setHours(0, 0, 0, 0);

        // Get logs from the last 7 days
        const logs = await Log.find({
            user: userId,
            date: { $gte: weekAgo, $lte: today }
        }).populate('habit', 'title');

        // Group logs by day
        const dailyStats = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekAgo);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            dailyStats[dateStr] = {
                date: dateStr,
                dayName: days[date.getDay()],
                completed: 0,
                total: 0,
                habits: []
            };
        }

        // Populate daily stats
        logs.forEach(log => {
            const dateStr = new Date(log.date).toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                dailyStats[dateStr].total++;
                if (log.status === 'completed') {
                    dailyStats[dateStr].completed++;
                    dailyStats[dateStr].habits.push(log.habit?.title || 'Unknown');
                }
            }
        });

        // Calculate best and worst days
        const statsArray = Object.values(dailyStats);
        const bestDay = statsArray.reduce((best, day) =>
            day.completed > best.completed ? day : best, statsArray[0]);
        const worstDay = statsArray.reduce((worst, day) =>
            day.total > 0 && day.completed < worst.completed ? day : worst, statsArray[0]);

        res.status(200).json({
            weekRange: {
                start: weekAgo.toISOString().split('T')[0],
                end: today.toISOString().split('T')[0]
            },
            dailyBreakdown: statsArray,
            bestDay: {
                date: bestDay.date,
                dayName: bestDay.dayName,
                completed: bestDay.completed
            },
            worstDay: {
                date: worstDay.date,
                dayName: worstDay.dayName,
                completed: worstDay.completed
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Calculate date range for the last 30 days
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 29);
        monthAgo.setHours(0, 0, 0, 0);

        // Get logs from the last 30 days
        const logs = await Log.find({
            user: userId,
            date: { $gte: monthAgo, $lte: today }
        }).populate('habit', 'title');

        // Get all habits for the user
        const habits = await Habit.find({ user: userId });

        // Calculate per-habit statistics
        const habitStats = {};
        habits.forEach(habit => {
            habitStats[habit._id.toString()] = {
                habitId: habit._id,
                title: habit.title,
                currentStreak: habit.streak,
                completed: 0,
                total: 0,
                completionRate: 0
            };
        });

        // Populate habit statistics
        logs.forEach(log => {
            const habitId = log.habit?._id?.toString();
            if (habitId && habitStats[habitId]) {
                habitStats[habitId].total++;
                if (log.status === 'completed') {
                    habitStats[habitId].completed++;
                }
            }
        });

        // Calculate completion rates
        Object.values(habitStats).forEach(stat => {
            if (stat.total > 0) {
                stat.completionRate = ((stat.completed / stat.total) * 100).toFixed(2);
            }
        });

        // Sort habits by completion rate
        const sortedHabits = Object.values(habitStats).sort((a, b) =>
            parseFloat(b.completionRate) - parseFloat(a.completionRate));

        // Calculate overall monthly completion rate
        const totalLogs = logs.length;
        const completedLogs = logs.filter(log => log.status === 'completed').length;
        const monthlyCompletionRate = totalLogs > 0 ?
            ((completedLogs / totalLogs) * 100).toFixed(2) : 0;

        res.status(200).json({
            monthRange: {
                start: monthAgo.toISOString().split('T')[0],
                end: today.toISOString().split('T')[0]
            },
            overallCompletionRate: monthlyCompletionRate,
            totalCompleted: completedLogs,
            totalLogged: totalLogs,
            habitPerformance: sortedHabits,
            topHabit: sortedHabits[0] || null,
            needsAttention: sortedHabits.filter(h => parseFloat(h.completionRate) < 50)
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getHabitAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { habitId } = req.params;

        // Verify habit belongs to user
        const habit = await Habit.findOne({ _id: habitId, user: userId });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Get all logs for this habit
        const logs = await Log.find({ habit: habitId, user: userId }).sort({ date: -1 });

        const totalLogs = logs.length;
        const completedLogs = logs.filter(log => log.status === 'completed').length;
        const skippedLogs = logs.filter(log => log.status === 'skipped').length;
        const failedLogs = logs.filter(log => log.status === 'failed').length;

        const completionRate = totalLogs > 0 ?
            ((completedLogs / totalLogs) * 100).toFixed(2) : 0;

        // Get last 30 days of activity
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const recentLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);

        // Calculate streak history (last 10 completed dates)
        const completedDates = logs
            .filter(log => log.status === 'completed')
            .slice(0, 10)
            .map(log => new Date(log.date).toISOString().split('T')[0]);

        res.status(200).json({
            habit: {
                id: habit._id,
                title: habit.title,
                description: habit.description,
                frequency: habit.frequency,
                currentStreak: habit.streak
            },
            statistics: {
                totalLogs,
                completed: completedLogs,
                skipped: skippedLogs,
                failed: failedLogs,
                completionRate
            },
            recentActivity: {
                last30Days: recentLogs.length,
                completedLast30Days: recentLogs.filter(log => log.status === 'completed').length
            },
            streakHistory: completedDates,
            lastCompleted: completedDates[0] || null
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTrends = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get date ranges for comparison
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);
        twoWeeksAgo.setHours(0, 0, 0, 0);

        const fourWeeksAgo = new Date(today);
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 27);
        fourWeeksAgo.setHours(0, 0, 0, 0);

        // Get logs for the last 4 weeks
        const allLogs = await Log.find({
            user: userId,
            date: { $gte: fourWeeksAgo, $lte: today }
        }).populate('habit', 'title');

        // Split into two periods
        const recentLogs = allLogs.filter(log => new Date(log.date) >= twoWeeksAgo);
        const olderLogs = allLogs.filter(log => new Date(log.date) < twoWeeksAgo);

        // Get all habits
        const habits = await Habit.find({ user: userId });

        // Calculate trends per habit
        const habitTrends = habits.map(habit => {
            const habitId = habit._id.toString();

            const recentHabitLogs = recentLogs.filter(log =>
                log.habit?._id?.toString() === habitId);
            const olderHabitLogs = olderLogs.filter(log =>
                log.habit?._id?.toString() === habitId);

            const recentCompleted = recentHabitLogs.filter(log =>
                log.status === 'completed').length;
            const olderCompleted = olderHabitLogs.filter(log =>
                log.status === 'completed').length;

            const recentRate = recentHabitLogs.length > 0 ?
                (recentCompleted / recentHabitLogs.length) * 100 : 0;
            const olderRate = olderHabitLogs.length > 0 ?
                (olderCompleted / olderHabitLogs.length) * 100 : 0;

            const trend = recentRate - olderRate;

            return {
                habitId: habit._id,
                title: habit.title,
                currentStreak: habit.streak,
                recentCompletionRate: recentRate.toFixed(2),
                previousCompletionRate: olderRate.toFixed(2),
                trendPercentage: trend.toFixed(2),
                status: trend > 10 ? 'improving' : trend < -10 ? 'declining' : 'stable'
            };
        });

        // Categorize habits
        const improving = habitTrends.filter(h => h.status === 'improving')
            .sort((a, b) => parseFloat(b.trendPercentage) - parseFloat(a.trendPercentage));
        const declining = habitTrends.filter(h => h.status === 'declining')
            .sort((a, b) => parseFloat(a.trendPercentage) - parseFloat(b.trendPercentage));
        const stable = habitTrends.filter(h => h.status === 'stable');

        // Find peak performance day of week
        const dayOfWeekStats = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach((day, index) => {
            dayOfWeekStats[day] = { completed: 0, total: 0 };
        });

        recentLogs.forEach(log => {
            const dayName = days[new Date(log.date).getDay()];
            dayOfWeekStats[dayName].total++;
            if (log.status === 'completed') {
                dayOfWeekStats[dayName].completed++;
            }
        });

        const peakDay = Object.entries(dayOfWeekStats).reduce((peak, [day, stats]) => {
            const rate = stats.total > 0 ? stats.completed / stats.total : 0;
            return rate > peak.rate ? { day, rate, ...stats } : peak;
        }, { day: 'N/A', rate: 0, completed: 0, total: 0 });

        res.status(200).json({
            summary: {
                improving: improving.length,
                declining: declining.length,
                stable: stable.length
            },
            improvingHabits: improving,
            decliningHabits: declining,
            stableHabits: stable,
            peakPerformance: {
                dayOfWeek: peakDay.day,
                completionRate: (peakDay.rate * 100).toFixed(2),
                completed: peakDay.completed,
                total: peakDay.total
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
