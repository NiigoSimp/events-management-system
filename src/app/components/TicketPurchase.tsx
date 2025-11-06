'use client'
import { useState } from 'react'

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

interface TicketPurchaseProps {
    event: Event
    onClose: () => void
    onTicketPurchased?: () => void
}

export default function TicketPurchase({ event, onClose, onTicketPurchased }: TicketPurchaseProps) {
    const [ticketQuantity, setTicketQuantity] = useState('1') // Changed to string
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const quantity = parseInt(ticketQuantity)

        // Validate ticket quantity
        if (isNaN(quantity) || quantity < 1) {
            alert('Số lượng vé phải là số lớn hơn 0')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/tickets/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: event.id,
                    quantity: quantity,
                    customerName,
                    customerEmail,
                    totalAmount: event.ticketPrice * quantity
                }),
            })

            if (response.ok) {
                const result = await response.json()
                console.log('Ticket purchase successful:', result)

                // Call the callback if provided
                if (onTicketPurchased) {
                    await onTicketPurchased()
                }

                onClose()

                alert(`Đặt vé thành công! Bạn đã đặt ${quantity} vé cho sự kiện ${event.name}`)
            } else {
                console.error('Failed to purchase ticket')
                alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.')
            }
        } catch (error) {
            console.error('Error purchasing ticket:', error)
            alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const quantity = parseInt(ticketQuantity) || 0
    const totalAmount = event.ticketPrice * quantity

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTicketQuantity(e.target.value)
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#1f2937'
                    }}>
                        Đặt Vé - {event.name}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '0.5rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Event Info */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '8px',
                        borderLeft: '4px solid #884499'
                    }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Thông tin sự kiện</h3>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            <strong>Ngày:</strong> {new Date(event.date).toLocaleDateString('vi-VI')}
                        </p>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            <strong>Địa điểm:</strong> {event.location}
                        </p>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            <strong>Giá vé:</strong> ${event.ticketPrice}
                        </p>
                    </div>

                    {/* Ticket Quantity Input */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Số lượng vé *
                        </label>
                        <input
                            type="text"
                            value={ticketQuantity}
                            onChange={handleQuantityChange}
                            required
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
                            placeholder="Nhập số lượng vé"
                        />
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Họ và tên *
                        </label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
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
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>

                    {/* Customer Email */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
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
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    {/* Price Breakdown */}
                    <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #bae6fd'
                    }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#0369a1' }}>Chi tiết thanh toán</h4>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <span style={{ color: '#6b7280' }}>Giá vé:</span>
                            <span>${event.ticketPrice} × {quantity}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#0369a1',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid #bae6fd'
                        }}>
                            <span>Tổng tiền:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'flex-end',
                        marginTop: '1.5rem'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                color: '#374151',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: loading ? '#9ca3af' : '#884499',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) e.currentTarget.style.backgroundColor = '#773388'
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) e.currentTarget.style.backgroundColor = '#884499'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid transparent',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                `Đặt ${quantity} vé - $${totalAmount.toFixed(2)}`
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}