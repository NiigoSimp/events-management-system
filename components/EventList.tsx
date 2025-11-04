'use client';

import { useState, useEffect } from 'react';

interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    description: string;
    category: string;
    ticketPrice: number;
    status: string;
}

export default function EventsList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/events');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEvents(result.data || []);
            } else {
                throw new Error(result.error || 'Failed to fetch events');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="p-4">Loading events...</div>;
    }

    if (error) {
        return (
            <div className="p-4 text-red-600">
                <h3 className="text-lg font-semibold">Error loading events</h3>
                <p>{error}</p>
                <button
                    onClick={fetchEvents}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events ({events.length})</h2>

            {events.length === 0 ? (
                <p>No events found</p>
            ) : (
                <div className="grid gap-4">
                    {events.map(event => (
                        <div key={event.id} className="border p-4 rounded shadow">
                            <h3 className="text-xl font-semibold">{event.name}</h3>
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Category:</strong> {event.category}</p>
                            <p><strong>Price:</strong> ${event.ticketPrice.toLocaleString()}</p>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}