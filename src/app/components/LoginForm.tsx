'use client'
import { useState } from 'react'
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

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
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            if (result.success) {
                setMessage(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!')
                if (isLogin) {
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1000)
                }
            } else {
                setMessage(`Lỗi: ${result.error}`)
            }
        } catch (error) {
            setMessage('Đã xảy ra lỗi')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
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
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
                </button>

                {message && (
                    <p style={{
                        textAlign: 'center',
                        color: message.includes('Lỗi') ? '#dc2626' : '#059669',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        backgroundColor: message.includes('Lỗi') ? '#fef2f2' : '#f0fdf4'
                    }}>
                        {message}
                    </p>
                )}
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#884499',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                    }}
                >
                    {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : 'Đã có tài khoản? Đăng nhập'}
                </button>
            </div>
        </div>
    )
}