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

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/events');

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setEvents(result.data);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const createEvent = async (eventData: Omit<Event, 'id'>) => {
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const result = await response.json();

            if (result.success) {
                await fetchEvents();
                return { success: true, event: result.data };
            } else {
                throw new Error(result.error || 'Failed to create event');
            }
        } catch (err) {
            console.error('Error creating event:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const eventsToDisplay = Array.isArray(events) ? events : [];

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-center text-black">Loading events...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="text-red-600 text-center">
                    <p className="text-black">Error: {error}</p>
                    <button
                        onClick={fetchEvents}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-black">Event Management System</h1>

            {/* Form tạo sự kiện với text màu đen */}
            <EventForm onCreateEvent={createEvent} />

            {/* Danh sách sự kiện */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-black">
                    Upcoming Events ({eventsToDisplay.length})
                </h2>

                {eventsToDisplay.length === 0 ? (
                    <p className="text-gray-700">No events found. Create your first event!</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {eventsToDisplay.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Component Form tạo sự kiện với text màu đen
function EventForm({ onCreateEvent }: { onCreateEvent: (eventData: any) => Promise<any> }) {
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        description: '',
        category: 'Technology',
        ticketPrice: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const result = await onCreateEvent(formData);

        if (result.success) {
            setFormData({
                name: '',
                date: '',
                location: '',
                description: '',
                category: 'Technology',
                ticketPrice: 0
            });
            alert('Event created successfully!');
        } else {
            alert(`Failed to create event: ${result.error}`);
        }

        setIsCreating(false);
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 text-black">Create New Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Event Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2 border rounded text-black bg-white"
                        placeholder="Enter event name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Date</label>
                    <input
                        type="datetime-local"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full p-2 border rounded text-black bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Location</label>
                    <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full p-2 border rounded text-black bg-white"
                        placeholder="Enter event location"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-2 border rounded text-black bg-white"
                        placeholder="Enter event description"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-2 border rounded text-black bg-white"
                    >
                        <option value="Technology">Technology</option>
                        <option value="Music">Music</option>
                        <option value="Business">Business</option>
                        <option value="Sports">Sports</option>
                        <option value="Education">Education</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-black">Ticket Price ($)</label>
                    <input
                        type="number"
                        value={formData.ticketPrice}
                        onChange={(e) => setFormData({...formData, ticketPrice: parseInt(e.target.value) || 0})}
                        className="w-full p-2 border rounded text-black bg-white"
                        placeholder="Enter ticket price"
                        min="0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400 hover:bg-green-600 transition-colors"
                >
                    {isCreating ? 'Creating...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
}

// Component hiển thị thông tin sự kiện với text màu đen
function EventCard({ event }: { event: Event }) {
    return (
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow bg-white">
            <h3 className="text-xl font-semibold mb-2 text-black">{event.name}</h3>
            <p className="text-gray-800 mb-1">
                <strong className="text-black">Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-800 mb-1">
                <strong className="text-black">Location:</strong> {event.location}
            </p>
            <p className="text-gray-800 mb-1">
                <strong className="text-black">Category:</strong> {event.category}
            </p>
            <p className="text-gray-800 mb-2">
                <strong className="text-black">Price:</strong> ${event.ticketPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">{event.description}</p>
        </div>
    );
}