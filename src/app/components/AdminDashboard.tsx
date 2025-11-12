'use client'
import { useState, useEffect } from 'react'

interface DashboardStats {
    totalEvents: number
    totalUsers: number
    totalTickets: number
    totalRevenue: number
    upcomingEvents: any[]
    topEvents: any[]
    eventCategories: any[]
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    const fetchDashboardData = async () => {
        try {
            // For now, let's just fetch basic data
            const [eventsResponse] = await Promise.all([
                fetch('/api/events')
            ])

            const eventsData = await eventsResponse.json()

            // Calculate total tickets and revenue from events
            const totalTickets = eventsData.data?.reduce((sum: number, event: any) => sum + (event.ticketsSold || 0), 0) || 0
            const totalRevenue = eventsData.data?.reduce((sum: number, event: any) => {
                // Assuming average ticket price of $50 for revenue calculation
                // You can modify this based on your actual ticket pricing
                return sum + ((event.ticketsSold || 0) * 50)
            }, 0) || 0

            setStats({
                totalEvents: eventsData.data?.length || 0,
                totalUsers: 0, // You'll need to implement users API
                totalTickets: totalTickets, // Added actual ticket count
                totalRevenue: totalRevenue, // Added revenue calculation
                upcomingEvents: eventsData.data?.filter((event: any) =>
                    new Date(event.date) > new Date()
                ) || [],
                topEvents: eventsData.data?.slice(0, 5) || [], // Show first 5 events as top events
                eventCategories: Array.from(new Set(eventsData.data?.map((event: any) => event.category).filter(Boolean))) || []
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    // Added function to handle event creation callback
    const handleEventCreated = async () => {
        await fetchDashboardData() // Refresh data when new event is created
    }

    if (loading) return <div className="p-6">Đang tải dữ liệu...</div>

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                Bảng Điều Khiển
            </h1>

            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Tổng Sự Kiện
                    </h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        {stats?.totalEvents || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Tổng Người Dùng
                    </h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        {stats?.totalUsers || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Tổng Vé Đã Bán
                    </h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        {stats?.totalTickets || 0}
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Tổng Doanh Thu
                    </h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        ${stats?.totalRevenue?.toLocaleString() || 0}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb' }}>
                    <button
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            borderBottom: activeTab === 'overview' ? '2px solid #2563eb' : 'none',
                            color: activeTab === 'overview' ? '#2563eb' : '#6b7280',
                            fontWeight: activeTab === 'overview' ? '600' : 'normal',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('overview')}
                    >
                        Tổng Quan
                    </button>
                    <button
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            borderBottom: activeTab === 'events' ? '2px solid #2563eb' : 'none',
                            color: activeTab === 'events' ? '#2563eb' : '#6b7280',
                            fontWeight: activeTab === 'events' ? '600' : 'normal',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('events')}
                    >
                        Sự Kiện
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem'
                }}>
                    {/* Upcoming Events */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                            🗓️ Sự Kiện Sắp Diễn Ra
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats?.upcomingEvents?.map((event: any) => (
                                <div key={event.id} style={{
                                    padding: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    backgroundColor: '#f9fafb'
                                }}>
                                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{event.name}</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        📅 {new Date(event.date).toLocaleDateString('vi-VI')} • 📍 {event.location}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        🎫 Vé đã bán: {event.ticketsSold || 0}
                                    </p>
                                </div>
                            ))}
                            {(!stats?.upcomingEvents || stats.upcomingEvents.length === 0) && (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    Không có sự kiện sắp diễn ra
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                            ⚡ Hành Động Nhanh
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                onClick={() => window.location.href = '/admin/create-event'}
                                style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#bb5688',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ color: 'white' }}>✙</span> Tạo Sự Kiện Mới
                            </button>

                            <button
                                onClick={fetchDashboardData}
                                style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#8888cc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                🔄 Làm Mới Dữ Liệu
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/events')
                                        const data = await response.json()
                                        alert(`Có ${data.data?.length || 0} sự kiện trong hệ thống`)
                                    } catch (error) {
                                        alert('Lỗi khi tải dữ liệu sự kiện')
                                    }
                                }}
                                style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#CCAA88',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                📈 Xem Thống Kê
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'events' && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        📊 Phân Tích Sự Kiện
                    </h3>

                    {/* Added event categories display */}
                    {stats?.eventCategories && stats.eventCategories.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                Danh Mục Sự Kiện
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {stats.eventCategories.map((category: string, index: number) => (
                                    <span key={index} style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        color: '#374151'
                                    }}>
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Added top events display */}
                    {stats?.topEvents && stats.topEvents.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                Sự Kiện Hàng Đầu
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {stats.topEvents.map((event: any) => (
                                    <div key={event.id} style={{
                                        padding: '0.75rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        backgroundColor: '#f9fafb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '500' }}>{event.name}</span>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                🎫 {event.ticketsSold || 0} vé
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!stats?.eventCategories || stats.eventCategories.length === 0) &&
                        (!stats?.topEvents || stats.topEvents.length === 0) && (
                            <p style={{ color: '#6b7280' }}>
                                Tính năng phân tích chi tiết đang được phát triển...
                            </p>
                        )}
                </div>
            )}
        </div>
    )
}