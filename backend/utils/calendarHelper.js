const { google } = require('googleapis');
require('dotenv').config();

// Setup Google Calendar API client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

exports.listEvents = async (auth) => {
    try {
        const calendar = google.calendar({ version: 'v3', auth });
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return response.data.items || [];
    } catch (error) {
        console.error('Error listing calendar events:', error);
        throw new Error('Failed to list calendar events');
    }
};

exports.createEvent = async (auth, eventDetails) => {
    try {
        const calendar = google.calendar({ version: 'v3', auth });
        const event = {
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: {
                dateTime: eventDetails.startTime,
                timeZone: 'UTC',
            },
            end: {
                dateTime: eventDetails.endTime,
                timeZone: 'UTC',
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 30 },
                ],
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw new Error('Failed to create calendar event');
    }
};

exports.getAuthClient = () => {
    return oauth2Client;
};
