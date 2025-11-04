'use client';

import { useState, useEffect } from 'react';

interface Event {
    eventId: string;
    eventName: string;
    location: string;
    startDate: string;
    endDate: string;
    category: string;
    status: string;
}

interface CategoryStat {
    category: string;
    eventCount: number;
}

interface RevenueStat {
    eventId: string;
    eventName: string;
    totalRegistrations: number;
    totalRevenue: number;
    averageTicketValue: number;
}

export default function Dashboard() {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
    const [revenueStats, setRevenueStats] = useState<RevenueStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [eventsRes, categoriesRes, revenueRes] = await Promise.all([
                fetch('/api/events/upcoming'),
                fetch('/api/events/category-stats'),
                fetch('/api/analytics/revenue')
            ]);

            const eventsData = await eventsRes.json();
            const categoriesData = await categoriesRes.json();
            const revenueData = await revenueRes.json();

            if (eventsData.success) setUpcomingEvents(eventsData.data);
            if (categoriesData.success) setCategoryStats(categoriesData.data);
            if (revenueData.success) setRevenueStats(revenueData.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-8">
            {/* Category Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Events by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoryStats.map(stat => (
                        <div key={stat.category} className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{stat.eventCount}</div>
                            <div className="text-sm text-gray-600">{stat.category}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                    {upcomingEvents.map(event => (
                        <div key={event.eventId} className="border rounded-lg p-4 hover:bg-gray-50">
                            <h3 className="font-semibold text-lg">{event.eventName}</h3>
                            <p className="text-gray-600">{event.location} • {new Date(event.startDate).toLocaleDateString()}</p>
                            <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                {event.category}
              </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Revenue Overview</h2>
                <div className="space-y-3">
                    {revenueStats.map(stat => (
                        <div key={stat.eventId} className="flex justify-between items-center border-b pb-2">
                            <div>
                                <div className="font-medium">{stat.eventName}</div>
                                <div className="text-sm text-gray-600">{stat.totalRegistrations} registrations</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-600">${stat.totalRevenue.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Avg: ${stat.averageTicketValue}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}