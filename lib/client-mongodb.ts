// This file contains client-side safe MongoDB utilities

export interface Event {
    _id?: string;
    title: string;
    description: string;
    location: string;
    date: string;
    customerId: string;
    employeeId: string;
    status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

// Client-side API calls
export const eventAPI = {
    // Get all events
    async getEvents(location?: string, status?: string): Promise<Event[]> {
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (status) params.append('status', status);

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    // Create event
    async createEvent(eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to create event');
        return response.json();
    },

    // Update event
    async updateEvent(id: string, eventData: Partial<Event>): Promise<void> {
        const response = await fetch(`/api/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to update event');
    },

    // Delete event
    async deleteEvent(id: string): Promise<void> {
        const response = await fetch(`/api/events?id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete event');
    },
};