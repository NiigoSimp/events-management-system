import type { Metadata } from "next";
import Navigation from '../components/Navigation';
import { AuthProvider } from '@/components/lib/auth/AuthProvider';
import AuthGuard from '../components/auth/AuthGuard';
import './globals.css';

export const metadata: Metadata = {
    title: "Event Management System",
    description: "Hệ thống quản lý sự kiện chuyên nghiệp",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
        <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        <AuthProvider>
            <AuthGuard>
                <Navigation />
                <div style={{ padding: '20px' }}>
                    {children}
                </div>
            </AuthGuard>
        </AuthProvider>
        </body>
        </html>
    );
}