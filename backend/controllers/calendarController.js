const calendarHelper = require('../utils/calendarHelper');
const Habit = require('../models/Habit');

exports.syncCalendar = async (req, res) => {
    try {
        // Check if Google Calendar credentials are configured
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            return res.status(200).json({
                message: 'Google Calendar integration not configured',
                note: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable calendar sync'
            });
        }

        const userId = req.user.id;
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        // Set credentials
        const authClient = calendarHelper.getAuthClient();
        authClient.setCredentials({ access_token: accessToken });

        // Get user's habits
        const habits = await Habit.find({ user: userId });

        if (habits.length === 0) {
            return res.status(200).json({ message: 'No habits to sync' });
        }

        // Create calendar events for habits
        const createdEvents = [];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // Default to 9 AM

        for (const habit of habits) {
            const eventDetails = {
                summary: `Habit: ${habit.title}`,
                description: habit.description || `Time to complete your habit: ${habit.title}`,
                startTime: tomorrow.toISOString(),
                endTime: new Date(tomorrow.getTime() + 30 * 60000).toISOString(), // 30 minutes
            };

            try {
                const event = await calendarHelper.createEvent(authClient, eventDetails);
                createdEvents.push({ habit: habit.title, eventId: event.id });
            } catch (error) {
                console.error(`Failed to create event for habit ${habit.title}:`, error);
            }
        }

        res.status(200).json({
            message: 'Calendar sync completed',
            synced: createdEvents.length,
            events: createdEvents
        });
    } catch (error) {
        console.error('Error syncing calendar:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
