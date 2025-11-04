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
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Category Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Events by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoryStats.map(stat => (
                        <div key={stat.category} className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{stat.eventCount}</div>
                            <div className="text-sm text-gray-700 font-medium">{stat.category}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Upcoming Events</h2>
                <div className="space-y-4">
                    {upcomingEvents.map(event => (
                        <div key={event.eventId} className="border border-gray-200 rounded-xl p-4 hover:bg-blue-50 transition-colors">
                            <h3 className="font-semibold text-lg text-gray-900">{event.eventName}</h3>
                            <p className="text-gray-600 mt-1">{event.location} • {new Date(event.startDate).toLocaleDateString()}</p>
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-2 font-medium">
                {event.category}
              </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Revenue Overview</h2>
                <div className="space-y-4">
                    {revenueStats.map(stat => (
                        <div key={stat.eventId} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0">
                            <div>
                                <div className="font-semibold text-gray-900">{stat.eventName}</div>
                                <div className="text-sm text-gray-600">{stat.totalRegistrations} registrations</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-600 text-lg">${stat.totalRevenue.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Avg: ${stat.averageTicketValue}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}