exports.calculateStreak = (habit, logs) => {
    // Filter logs for this habit and completed status
    const habitLogs = logs
        .filter(log => log.habit.toString() === habit._id.toString() && log.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending

    if (habitLogs.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastLogDate = new Date(habitLogs[0].date);
    lastLogDate.setHours(0, 0, 0, 0);

    // If last log is not today or yesterday, streak is broken (0)
    if (lastLogDate.getTime() !== today.getTime() && lastLogDate.getTime() !== yesterday.getTime()) {
        return 0;
    }

    let streak = 1;
    let currentDate = lastLogDate;

    for (let i = 1; i < habitLogs.length; i++) {
        const logDate = new Date(habitLogs[i].date);
        logDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);

        if (logDate.getTime() === expectedDate.getTime()) {
            streak++;
            currentDate = logDate;
        } else if (logDate.getTime() === currentDate.getTime()) {
            // Same day, ignore (multiple logs per day shouldn't break streak but shouldn't add to it if daily)
            continue;
        } else {
            // Break in streak
            break;
        }
    }

    return streak;
};
