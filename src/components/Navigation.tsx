'use client';

import { useAuth } from './lib/auth/useAuth';

export default function Navigation() {
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Brand - Bên trái */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            C-Event
                        </h1>
                    </div>

                    {/* Navigation Links - Ở giữa */}
                    <div className="flex items-center space-x-8">
                        <a
                            href="/events"
                            className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                        >
                            Sự Kiện
                        </a>
                    </div>

                    {/* User Section - Bên phải */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="font-medium text-gray-900 text-sm">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200 border border-gray-300 font-medium"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <a
                                href="/login"
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors duration-200"
                            >
                                Đăng nhập
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}