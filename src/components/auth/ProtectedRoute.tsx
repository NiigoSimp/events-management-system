'use client';
import { useRouteGuard } from '@/components/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'user' | 'admin';
    fallback?: React.ReactNode;
    showLoading?: boolean;
}

export default function ProtectedRoute({
                                           children,
                                           requiredRole = 'user',
                                           fallback,
                                           showLoading = true
                                       }: ProtectedRouteProps) {
    const { canAccess, loading, isAuthenticated } = useRouteGuard(requiredRole);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            const redirectUrl = window.location.pathname + window.location.search;
            router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
        }
    }, [isAuthenticated, loading, router]);

    if (loading && showLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!canAccess) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}