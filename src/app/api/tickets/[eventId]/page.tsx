'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

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

export default function TicketPurchasePage() {
    const params = useParams()
    const eventId = params.eventId as string

    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [ticketQuantity, setTicketQuantity] = useState(1)
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: ''
    })

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}`)
                const data = await response.json()
                if (data.success) {
                    setEvent(data.data)
                }
            } catch (error) {
                console.error('Error fetching event:', error)
            } finally {
                setLoading(false)
            }
        }

        if (eventId) {
            fetchEvent()
        }
    }, [eventId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePurchase = async () => {
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            alert('Vui lòng điền đầy đủ thông tin')
            return
        }

        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: eventId,
                    quantity: ticketQuantity,
                    customerName: customerInfo.name,
                    customerEmail: customerInfo.email,
                    customerPhone: customerInfo.phone,
                    totalAmount: event ? event.ticketPrice * ticketQuantity : 0
                })
            })

            const result = await response.json()

            if (result.success) {
                alert('🎉 Đặt vé thành công! Vé đã được gửi đến email của bạn.')
                // Redirect to home or confirmation page
                window.location.href = '/'
            } else {
                alert(`Lỗi: ${result.error}`)
            }
        } catch (error) {
            alert('Đã xảy ra lỗi khi đặt vé')
            console.error('Error purchasing ticket:', error)
        }
    }

    const totalPrice = event ? event.ticketPrice * ticketQuantity : 0

    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            fontSize: '1.125rem',
            color: '#6b7280'
        }}>
            🌀 Đang tải thông tin sự kiện...
        </div>
    )

    if (!event) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            fontSize: '1.125rem',
            color: '#dc2626'
        }}>
            ❌ Không tìm thấy sự kiện
        </div>
    )

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '2rem',
                border: '1px solid #e5e7eb'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    🎫 Đặt Vé Tham Dự
                </h1>

                {/* Event Info */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    borderLeft: '4px solid #884499'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                        {event.name}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '500', minWidth: '100px' }}>📅 Ngày:</span>
                            <span>{new Date(event.date).toLocaleDateString('vi-VI')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '500', minWidth: '100px' }}>📍 Địa điểm:</span>
                            <span>{event.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '500', minWidth: '100px' }}>💰 Giá vé:</span>
                            <span style={{ fontWeight: '600', color: '#059669' }}>${event.ticketPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Ticket Quantity */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '1rem'
                    }}>
                        Số lượng vé
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#884499',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            -
                        </button>
                        <span style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            minWidth: '60px',
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>
                            {ticketQuantity}
                        </span>
                        <button
                            onClick={() => setTicketQuantity(prev => prev + 1)}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#884499',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Customer Information */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '1rem'
                    }}>
                        Thông tin khách hàng
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            name="name"
                            value={customerInfo.name}
                            onChange={handleInputChange}
                            placeholder="Họ và tên *"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            placeholder="Email *"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            placeholder="Số điện thoại *"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Order Summary */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '1rem'
                    }}>
                        Tổng thanh toán
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Giá vé x{ticketQuantity}:</span>
                        <span>${event.ticketPrice * ticketQuantity}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.125rem' }}>
                        <span>Tổng cộng:</span>
                        <span style={{ color: '#884499' }}>${totalPrice}</span>
                    </div>
                </div>

                {/* Purchase Button */}
                <button
                    onClick={handlePurchase}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#884499',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#773388'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#884499'}
                >
                    🎫 Xác Nhận Đặt Vé - ${totalPrice}
                </button>
            </div>
        </div>
    )
}