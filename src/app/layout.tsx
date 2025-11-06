import type { Metadata } from "next";
import Navigation from '../components/Navigation';
import './globals.css';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
        <Navigation />
        <div style={{ padding: '20px' }}>
            {children}
        </div>
        </body>
        </html>
    );
}