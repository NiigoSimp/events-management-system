'use client'
import { useState, useEffect } from 'react'
import CreateEventForm from './components/CreateEventForm'
import TicketPurchase from './components/TicketPurchase'
export const dynamic = 'force-dynamic';
export const revalidate = 0;
interface Event {
    id: string
    name: string
    date: string
    location: string
    description: string
    category: string
    ticketPrice: number
    maxAttendees: number
    status: string
    createdAt: string
}

const ICONS = {
    event: 'https://img.icons8.com/fluency/48/884499/event.png',
    calendar: 'https://img.icons8.com/fluency/48/000000/calendar.png',
    location: 'https://img.icons8.com/fluency/48/000000/marker.png',
    category: 'https://img.icons8.com/fluency/48/000000/price-tag.png',
    price: 'https://img.icons8.com/fluency/48/000000/money.png',
    people: 'https://img.icons8.com/fluency/48/000000/conference.png',
    search: 'https://img.icons8.com/fluency/48/000000/search.png',
    filter: 'https://img.icons8.com/fluency/48/000000/filter.png',
    create: 'https://img.icons8.com/fluency/48/000000/plus.png',
    cancel: 'https://img.icons8.com/fluency/48/000000/close.png',
    ticket: 'https://img.icons8.com/fluency/48/000000/ticket.png',
    empty: 'https://img.icons8.com/fluency/96/000000/empty-box.png',
    loading: 'https://img.icons8.com/fluency/96/000000/loading.png'
}

export default function HomePage() {
    const [events, setEvents] = useState<Event[]>([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [showTicketModal, setShowTicketModal] = useState(false)

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events')
            const data = await response.json()
            if (data.success) {
                setEvents(data.data)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchEvents()
    }, [])

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || event.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categories = Array.from(new Set(events.map(event => event.category)))

    // ADD THIS MISSING FUNCTION
    const handleTicketPurchase = (event: Event) => {
        console.log('Đặt Vé button clicked for event:', event.name)
        console.log('Event ID:', event.id)
        setSelectedEvent(event)
        setShowTicketModal(true)
        console.log('Modal should be visible now')
    }

    // ADD THIS MISSING FUNCTION
    const closeTicketModal = () => {
        console.log('Closing modal')
        setShowTicketModal(false)
        setSelectedEvent(null)
    }

    useEffect(() => {
        console.log('Modal state changed:', showTicketModal)
        console.log('Selected event:', selectedEvent)
    }, [showTicketModal, selectedEvent])

    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            fontSize: '1.125rem',
            color: '#6b7280',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <img
                src={ICONS.loading}
                alt="Loading"
                style={{ width: '64px', height: '64px' }}
            />
            🌀 Đang tải sự kiện...
        </div>
    )

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#884499',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem'
                    }}>
                        ⌨
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '0.5rem'
                        }}>
                            Sự Kiện
                        </h1>
                        <p style={{ color: '#6b7280' }}>
                            Khám phá các sự kiện sắp diễn ra
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        backgroundColor: '#884499',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 4px rgba(136, 68, 153, 0.3)',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#773388'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#884499'}
                >
                    <div style={{
                        width: '20px',
                        height: '20px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '2px',
                            backgroundColor: 'white',
                            position: 'absolute'
                        }}></div>
                        {!showForm && (
                            <div style={{
                                width: '2px',
                                height: '100%',
                                backgroundColor: 'white',
                                position: 'absolute'
                            }}></div>
                        )}
                    </div>
                    {showForm ? 'Hủy' : 'Tạo Sự Kiện'}
                </button>
            </div>

            {/* Search and Filter */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '1rem',
                marginBottom: '2rem',
                alignItems: 'end'
            }}>
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        <img
                            src={ICONS.search}
                            alt="Search"
                            style={{ width: '16px', height: '16px' }}
                        />
                        Tìm kiếm sự kiện
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm theo tên hoặc địa điểm..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#884499'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                </div>
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        <img
                            src={ICONS.filter}
                            alt="Filter"
                            style={{ width: '16px', height: '16px' }}
                        />
                        Lọc theo danh mục
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            minWidth: '150px',
                            transition: 'border-color 0.2s',
                            cursor: 'pointer'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#884499'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    >
                        <option value="">Tất cả</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Create Event Form - Only show when button is clicked */}
            {showForm && <CreateEventForm onEventCreated={fetchEvents} />}

            {/* Events Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredEvents.map((event) => (
                    <div key={event.id} style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                         onMouseEnter={(e) => {
                             e.currentTarget.style.transform = 'translateY(-4px)'
                             e.currentTarget.style.boxShadow = '0 8px 25px rgba(136, 68, 153, 0.15)'
                         }}
                         onMouseLeave={(e) => {
                             e.currentTarget.style.transform = 'translateY(0)'
                             e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                         }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                margin: 0,
                                flex: 1
                            }}>
                                {event.name}
                            </h2>
                            <span style={{
                                backgroundColor: event.status === 'active' ? '#dcfce7' : '#fef2f2',
                                color: event.status === 'active' ? '#166534' : '#dc2626',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                            }}>
                                {event.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src={ICONS.calendar}
                                    alt="Date"
                                    style={{ width: '16px', height: '16px', opacity: 0.7 }}
                                />
                                <span style={{ color: '#6b7280', minWidth: '60px' }}>Ngày:</span>
                                <span style={{ fontWeight: '500' }}>
                                    {new Date(event.date).toLocaleDateString('vi-VI')}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src={ICONS.location}
                                    alt="Location"
                                    style={{ width: '16px', height: '16px', opacity: 0.7 }}
                                />
                                <span style={{ color: '#6b7280', minWidth: '60px' }}>Địa điểm:</span>
                                <span style={{ fontWeight: '500' }}>{event.location}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src={ICONS.category}
                                    alt="Category"
                                    style={{ width: '16px', height: '16px', opacity: 0.7 }}
                                />
                                <span style={{ color: '#6b7280', minWidth: '60px' }}>Danh mục:</span>
                                <span style={{
                                    backgroundColor: '#f3f4f6',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem'
                                }}>
                                    {event.category}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src={ICONS.price}
                                    alt="Price"
                                    style={{ width: '16px', height: '16px', opacity: 0.7 }}
                                />
                                <span style={{ color: '#6b7280', minWidth: '60px' }}>Giá vé:</span>
                                <span style={{ fontWeight: '600', color: '#059669' }}>
                                    ${event.ticketPrice}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src={ICONS.people}
                                    alt="Attendees"
                                    style={{ width: '16px', height: '16px', opacity: 0.7 }}
                                />
                                <span style={{ color: '#6b7280', minWidth: '60px' }}>Số lượng:</span>
                                <span style={{ fontWeight: '500' }}>{event.maxAttendees} người</span>
                            </div>
                        </div>

                        {event.description && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                borderLeft: '4px solid #3b82f6'
                            }}>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.875rem',
                                    color: '#4b5563',
                                    lineHeight: '1.5'
                                }}>
                                    {event.description}
                                </p>
                            </div>
                        )}

                        <div style={{
                            marginTop: '1.5rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #e5e7eb'
                        }}>
                            <button
                                onClick={() => handleTicketPurchase(event)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#884499',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '500',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#773388'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#884499'}
                            >
                                <img
                                    src={ICONS.ticket}
                                    alt="Ticket"
                                    style={{ width: '16px', height: '16px' }}
                                />
                                Đặt Vé
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ticket Purchase Modal */}
            {showTicketModal && selectedEvent && (
                <TicketPurchase
                    event={selectedEvent}
                    onClose={closeTicketModal}
                    onTicketPurchased={fetchEvents}
                />
            )}

            {filteredEvents.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: '#6b7280'
                }}>
                    <img
                        src={ICONS.empty}
                        alt="No events"
                        style={{ width: '96px', height: '96px', marginBottom: '1rem', opacity: 0.5 }}
                    />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        Không tìm thấy sự kiện
                    </h3>
                    <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo sự kiện mới</p>
                </div>
            )}
        </div>
    )
}