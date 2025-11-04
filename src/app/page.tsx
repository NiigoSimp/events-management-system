'use client';

import { useState, useEffect } from 'react';

interface Event {
    id: string;
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
    const [showForm, setShowForm] = useState(false);

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
                setShowForm(false);
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

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Technology': 'bg-blue-100 text-blue-800',
            'Music': 'bg-purple-100 text-purple-800',
            'Business': 'bg-green-100 text-green-800',
            'Sports': 'bg-red-100 text-red-800',
            'Education': 'bg-orange-100 text-orange-800',
            'Art': 'bg-pink-100 text-pink-800',
            'Food': 'bg-yellow-100 text-yellow-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                EventFlow
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your events with ease</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {showForm ? '✕ Cancel' : '+ Create Event'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Create Event Form */}
                {showForm && (
                    <div className="mb-8 animate-fade-in">
                        <EventForm onCreateEvent={createEvent} onCancel={() => setShowForm(false)} />
                    </div>
                )}

                {/* Events Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                            <p className="text-gray-600 mt-1">
                                {eventsToDisplay.length} event{eventsToDisplay.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                    </div>

                    {eventsToDisplay.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
                            <p className="text-gray-600 mb-6">Create your first event to get started!</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Create Your First Event
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {eventsToDisplay.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    categoryColor={getCategoryColor(event.category)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Beautiful Event Form Component
function EventForm({
                       onCreateEvent,
                       onCancel
                   }: {
    onCreateEvent: (eventData: any) => Promise<any>;
    onCancel: () => void;
}) {
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
        } else {
            alert(`Failed to create event: ${result.error}`);
        }

        setIsCreating(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Event</h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter event name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter event location"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Business">Business</option>
                            <option value="Sports">Sports</option>
                            <option value="Education">Education</option>
                            <option value="Art">Art</option>
                            <option value="Food">Food</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Describe your event..."
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ticket Price ($)
                    </label>
                    <input
                        type="number"
                        value={formData.ticketPrice}
                        onChange={(e) => setFormData({...formData, ticketPrice: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="0"
                        min="0"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                        {isCreating ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            'Create Event'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Beautiful Event Card Component
function EventCard({ event, categoryColor }: { event: Event; categoryColor: string }) {
    const eventDate = new Date(event.date);
    const now = new Date();
    const isUpcoming = eventDate > now;

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200 group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                        {event.category}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{eventDate.toLocaleDateString()}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.name}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        ${event.ticketPrice === 0 ? 'Free' : event.ticketPrice.toLocaleString()}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {isUpcoming ? 'Upcoming' : 'Past Event'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}