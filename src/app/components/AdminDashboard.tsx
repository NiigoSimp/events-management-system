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

            setStats({
                totalEvents: eventsData.data?.length || 0,
                totalUsers: 0, // You'll need to implement users API
                totalTickets: 0, // You'll need to implement tickets API
                totalRevenue: 0,
                upcomingEvents: eventsData.data?.filter((event: any) =>
                    new Date(event.date) > new Date()
                ) || [],
                topEvents: [],
                eventCategories: []
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
                        Tổng Vé
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
                        ${stats?.totalRevenue || 0}
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
                                onClick={() => window.location.href = '/'}
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
                                <span style={{ color: 'white' }}>✙</span>  Tạo Sự Kiện Mới
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
                                    const response = await fetch('/api/queries?type=upcoming-events')
                                    const data = await response.json()
                                    console.log('Upcoming events:', data)
                                    alert(`Có ${data.data?.length || 0} sự kiện sắp diễn ra`)
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
                    <p style={{ color: '#6b7280' }}>
                        Tính năng phân tích chi tiết đang được phát triển...
                    </p>
                    <button
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/queries?type=event-categories')
                                const data = await response.json()
                                console.log('Event categories:', data)
                                alert('Đã tải dữ liệu phân loại sự kiện (xem console)')
                            } catch (error) {
                                alert('Lỗi khi tải dữ liệu')
                            }
                        }}
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#DDAACC',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Xem Phân Loại Sự Kiện
                    </button>
                </div>
            )}
        </div>
    )
}