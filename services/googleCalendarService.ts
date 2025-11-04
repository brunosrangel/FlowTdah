import { Task } from '../types/types';

export const syncTaskToCalendar = async (gapi: any, task: Task): Promise<string | undefined> => {
    if (!task.dueDate) return;

    const eventDate = new Date(`${task.dueDate}T00:00:00`);
    const nextDay = new Date(eventDate);
    nextDay.setDate(eventDate.getDate() + 1);
    
    const event = {
        'summary': task.title,
        'description': task.notes || '',
        'start': {
            'date': task.dueDate,
            'timeZone': 'America/Sao_Paulo',
        },
        'end': {
            'date': nextDay.toISOString().split('T')[0],
            'timeZone': 'America/Sao_Paulo',
        },
    };
    
    try {
        if (task.googleCalendarEventId) {
            // Update existing event
            await gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': task.googleCalendarEventId,
                'resource': event
            });
            console.log('Event updated');
            return task.googleCalendarEventId;
        } else {
            // Create new event
            const response = await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            console.log('Event created', response.result);
            return response.result.id;
        }
    } catch (error) {
        console.error("Error syncing with Google Calendar", error);
        throw error;
    }
};

export const deleteTaskFromCalendar = async (gapi: any, eventId: string): Promise<void> => {
    try {
        await gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': eventId
        });
        console.log('Event deleted');
    } catch (error) {
        console.error("Error deleting from Google Calendar", error);
        throw error;
    }
};
