'use client'
import React from 'react';
import { useState } from 'react'
import { useAuth } from '../lib/auth/useAuth'

interface DemoUser {
    id: string;
    email: string;
    password: string;
}

const ADMIN_ACCOUNT = { email: 'admin@demo.com', password: 'password' };
const DEMO_USERS = [
    { id: '1', email: 'user@demo.com', password: 'password' }
];

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const { login, register } = useAuth()

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
                await login({
                    email: formData.email,
                    password: formData.password
                })
                setMessage('Đăng nhập thành công!')
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            } else {
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
                setMessage('Đăng ký thành công!')
                setTimeout(() => {
                    setIsLogin(true)
                    setFormData(prev => ({ ...prev, name: '', password: '' }))
                }, 1500)
            }
        } catch (error: any) {
            setMessage(`Lỗi: ${error.message || 'Đã xảy ra lỗi kết nối'}`)
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
        setMessage('')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đăng Nhập
                    </h1>
                    <p className="text-gray-600">
                        Truy cập hệ thống quản lý sự kiện
                    </p>
                </div>

                {/* Login Info */}
                {isLogin && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Login</h3>
                        <p className="text-blue-800 text-sm">
                            Email {formData.email || 'admin@demo.com'}
                        </p>
                        <p className="text-blue-800 text-sm">
                            Password {formData.password ? '•'.repeat(formData.password.length) : '••••••••'}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Họ và Tên
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            isLogin ? 'Đăng Nhập' : 'Đăng Ký'
                        )}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-lg border ${
                            message.includes('Lỗi')
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-green-50 border-green-200 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}
                </form>

                {/* Demo Accounts Section */}
                {isLogin && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                            Tài khoản demo:
                        </h3>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials(ADMIN_ACCOUNT.email, ADMIN_ACCOUNT.password)}
                                className="w-full text-left p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">👑</span>
                                    <div>
                                        <div className="font-semibold text-purple-700 group-hover:text-purple-800">
                                            Tài khoản Admin
                                        </div>
                                        <div className="text-sm text-purple-600 mt-1">
                                            Email: {ADMIN_ACCOUNT.email}
                                        </div>
                                        <div className="text-sm text-purple-600">
                                            Password: {ADMIN_ACCOUNT.password}
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {DEMO_USERS.map((user: DemoUser, index: number) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => fillDemoCredentials(user.email, user.password)}
                                    className="w-full text-left p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">👤</span>
                                        <div>
                                            <div className="font-semibold text-blue-700 group-hover:text-blue-800">
                                                Tài khoản User {index + 1}
                                            </div>
                                            <div className="text-sm text-blue-600 mt-1">
                                                Email: {user.email}
                                            </div>
                                            <div className="text-sm text-blue-600">
                                                Password: {user.password}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toggle between Login/Register */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setMessage('')
                            setFormData(prev => ({ ...prev, name: '', password: '' }))
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200"
                    >
                        {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : 'Đã có tài khoản? Đăng nhập'}
                    </button>
                </div>
            </div>
        </div>
    )
}