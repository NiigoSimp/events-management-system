'use client'
import { useState } from 'react'
import { useAuth } from '../lib/auth/useAuth'
import { ADMIN_ACCOUNT, DEMO_USERS } from '../lib/auth/constants'

interface DemoUser {
    id: string;
    email: string;
    password: string;
}

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const { loginWithCredentials } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            if (isLogin) {
                // Sử dụng hệ thống auth mới
                const success = await loginWithCredentials(formData.email, formData.password)

                if (success) {
                    setMessage('Đăng nhập thành công!')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1000)
                } else {
                    setMessage('Lỗi: Email hoặc mật khẩu không đúng')
                }
            } else {
                // Đăng ký - giữ nguyên logic cũ
                const endpoint = '/api/auth/register'
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                const result = await response.json()
                if (result.success) {
                    setMessage('Đăng ký thành công!')
                    setTimeout(() => {
                        setIsLogin(true)
                        setFormData(prev => ({ ...prev, name: '', password: '' }))
                    }, 1500)
                } else {
                    setMessage(`Lỗi: ${result.error}`)
                }
            }
        } catch (error) {
            setMessage('Đã xảy ra lỗi kết nối')
        } finally {
            setLoading(false)
        }
    }

    const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
        setFormData(prev => ({
            ...prev,
            email: demoEmail,
            password: demoPassword
        }))
        setMessage('') // Clear error when filling demo credentials
    }

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(136, 68, 153, 0.1)',
            border: '1px solid #e5e7eb',
            maxWidth: '400px',
            margin: '2rem auto'
        }}>
            <h2 style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
            }}>
                {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {!isLogin && (
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Họ và Tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required={!isLogin}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            placeholder="Nhập họ và tên"
                            onFocus={(e) => e.target.style.borderColor = '#884499'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>
                )}

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        placeholder="Nhập email"
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
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        placeholder="Nhập mật khẩu"
                        onFocus={(e) => e.target.style.borderColor = '#884499'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: loading ? '#C096CB' : '#884499',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#773388'
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#884499'
                    }}
                >
                    {loading && (
                        <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    )}
                    {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
                </button>

                {message && (
                    <div style={{
                        textAlign: 'center',
                        color: message.includes('Lỗi') ? '#dc2626' : '#059669',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        backgroundColor: message.includes('Lỗi') ? '#fef2f2' : '#f0fdf4',
                        border: `1px solid ${message.includes('Lỗi') ? '#fecaca' : '#bbf7d0'}`
                    }}>
                        {message}
                    </div>
                )}
            </form>

            {/* Demo Accounts Section - Chỉ hiển thị khi đăng nhập */}
            {isLogin && (
                <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        Tài khoản demo:
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials(ADMIN_ACCOUNT.email, ADMIN_ACCOUNT.password)}
                            style={{
                                textAlign: 'left',
                                padding: '12px 16px',
                                backgroundColor: '#f3e8ff',
                                border: '1px solid #e9d5ff',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e9d5ff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3e8ff';
                            }}
                        >
                            <div style={{ fontWeight: '600', color: '#7c3aed', fontSize: '14px' }}>
                                👑 Tài khoản Admin
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '4px' }}>
                                Email: {ADMIN_ACCOUNT.email}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b5cf6' }}>
                                Password: {ADMIN_ACCOUNT.password}
                            </div>
                        </button>

                        {DEMO_USERS.map((user: DemoUser, index: number) => (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => fillDemoCredentials(user.email, user.password)}
                                style={{
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    backgroundColor: '#dbeafe',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#bfdbfe';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#dbeafe';
                                }}
                            >
                                <div style={{ fontWeight: '600', color: '#1d4ed8', fontSize: '14px' }}>
                                    👤 Tài khoản User {index + 1}
                                </div>
                                <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                                    Email: {user.email}
                                </div>
                                <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                                    Password: {user.password}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb'
            }}>
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin)
                        setMessage('')
                        setFormData(prev => ({ ...prev, name: '', password: '' }))
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#884499',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textDecoration: 'underline'
                    }}
                >
                    {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : 'Đã có tài khoản? Đăng nhập'}
                </button>
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