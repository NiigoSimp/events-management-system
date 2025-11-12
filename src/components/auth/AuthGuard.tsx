'use client';
import { useAuth } from '@/components/lib/auth/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/login', '/register'];
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/events', '/tickets'];
const ADMIN_ROUTES = ['/admin', '/admin/analytics', '/admin/users'];

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, loading, user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
        const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
        const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

        // Redirect to login if accessing protected route without authentication
        if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        // Redirect to unauthorized if accessing admin route without admin privileges
        if (isAuthenticated && isAdminRoute && user?.role !== 'admin') {
            router.push('/unauthorized');
            return;
        }

        // Redirect to dashboard if accessing login/register while authenticated
        if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
            router.push('/dashboard');
            return;
        }
    }, [isAuthenticated, loading, pathname, router, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}