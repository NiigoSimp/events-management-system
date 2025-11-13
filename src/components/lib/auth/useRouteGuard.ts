// components/lib/auth/useRouteGuard.ts
'use client';

import { useAuth } from './useAuth';

type UserRole = 'user' | 'admin';

export function useRouteGuard(requiredRole?: UserRole) {
    const { user, isLoading, isAuthenticated } = useAuth();

    const canAccess = !requiredRole || user?.role === requiredRole;

    return {
        canAccess,
        loading: isLoading,
        isAuthenticated,
        user
    };
}

export default useRouteGuard;