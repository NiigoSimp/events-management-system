// CreateEventForm.tsx
'use client'
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { useState } from 'react'

interface CreateEventFormProps {
    onEventCreated: () => Promise<void>;
}

interface EventFormData {
    name: string
    date: string
    location: string
    description: string
    category: string
    ticketPrice: number
    maxAttendees: number
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
    const [formData, setFormData] = useState<EventFormData>({
        name: '',
        date: '',
        location: '',
        description: '',
        category: '',
        ticketPrice: 0,
        maxAttendees: 0
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'ticketPrice' || name === 'maxAttendees' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                // Reset form
                setFormData({
                    name: '',
                    date: '',
                    location: '',
                    description: '',
                    category: '',
                    ticketPrice: 0,
                    maxAttendees: 0
                })

                // Call the callback function to refresh events
                await onEventCreated()
            } else {
                console.error('Failed to create event')
            }
        } catch (error) {
            console.error('Error creating event:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(136, 68, 153, 0.1)'
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
        <span style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#884499',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem'
        }}>
          +
        </span>
                Tạo Sự Kiện Mới
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Tên sự kiện *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
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
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Ngày diễn ra *
                        </label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
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
                        />
                    </div>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Địa điểm *
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
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
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            resize: 'vertical'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#884499'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Danh mục *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#884499'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        >
                            <option value="">Chọn danh mục</option>
                            <option value="Music">Âm nhạc</option>
                            <option value="Sports">Thể thao</option>
                            <option value="Technology">Công nghệ</option>
                            <option value="Business">Kinh doanh</option>
                            <option value="Education">Giáo dục</option>
                            <option value="Art">Nghệ thuật</option>
                            <option value="Food">Ẩm thực</option>
                            <option value="Other">Khác</option>
                        </select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Giá vé ($) *
                        </label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
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
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Số lượng vé *
                        </label>
                        <input
                            type="number"
                            name="maxAttendees"
                            value={formData.maxAttendees}
                            onChange={handleChange}
                            required
                            min="1"
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
                </div>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <button
                        type="button"
                        onClick={() => setFormData({
                            name: '',
                            date: '',
                            location: '',
                            description: '',
                            category: '',
                            ticketPrice: 0,
                            maxAttendees: 0
                        })}
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
                        Đặt lại
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
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.2rem' }}>+</span>
                                Tạo Sự Kiện
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}