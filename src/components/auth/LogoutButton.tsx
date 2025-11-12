'use client';
import { useState } from 'react';
import { useAuth } from '@/components/lib/auth/useAuth';

interface LogoutButtonProps {
    variant?: 'default' | 'minimal' | 'icon';
    className?: string;
    showConfirmation?: boolean;
}

export default function LogoutButton({
                                         variant = 'default',
                                         className = '',
                                         showConfirmation = true
                                     }: LogoutButtonProps) {
    const { user, logout, isAdmin } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        if (showConfirmation) {
            setShowModal(true);
        } else {
            performLogout();
        }
    };

    const performLogout = () => {
        logout();
        setShowModal(false);
        // Optional: redirect to home page after logout
        window.location.href = '/';
    };

    const cancelLogout = () => {
        setShowModal(false);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div className={`flex items-center gap-3 ${className}`}>
                {/* User Info */}
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                    </div>
                </div>

                {/* Admin Badge */}
                {isAdmin && (
                    <span className="hidden sm:inline bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200">
                        ADMIN
                    </span>
                )}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${variant === 'minimal'
                        ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        : variant === 'icon'
                            ? 'p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                    }
                    `}
                    title="Logout"
                >
                    {variant !== 'icon' && 'Logout'}
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                </button>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={performLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}