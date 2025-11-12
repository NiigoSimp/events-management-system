'use client';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

// Simple login hook
export function useAuthLogin() {
    const { loginWithCredentials } = useAuth();

    return { loginWithCredentials };
}

export function useAdmin() {
    const { isAdmin, user } = useAuth();

    const requireAdmin = () => {
        if (!isAdmin) {
            throw new Error('Bạn không có quyền truy cập trang này.');
        }
    };

    return {
        isAdmin,
        requireAdmin,
        adminUser: isAdmin ? user : null,
    };
}

export function useRouteGuard(requiredRole: 'user' | 'admin' = 'user') {
    const { isAdmin, isAuthenticated, loading } = useAuth();

    const hasPermission = requiredRole === 'admin' ? isAdmin : true;
    const canAccess = isAuthenticated && hasPermission;

    return {
        canAccess,
        hasPermission,
        isAuthenticated,
        loading,
        requiredRole,
    };
}