'use client';

import { useAuth } from '../lib/auth/useAuth'; // Updated import path
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export default function AuthGuard({
                                      children,
                                      requireAuth = true,
                                      redirectTo = '/login'
                                  }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                // Redirect to login if authentication is required but user is not authenticated
                router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
            } else if (!requireAuth && isAuthenticated) {
                // Redirect away from auth pages if user is already authenticated
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, router, pathname, redirectTo]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (requireAuth && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (!requireAuth && isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}