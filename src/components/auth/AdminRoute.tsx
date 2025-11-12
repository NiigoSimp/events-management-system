'use client';
import { useRouteGuard } from '@/components/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminRouteProps {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { canAccess, loading, isAuthenticated } = useRouteGuard('admin');
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
            } else if (!canAccess) {
                router.push('/unauthorized');
            }
        }
    }, [canAccess, isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!canAccess) {
        return null;
    }

    return <>{children}</>;
}