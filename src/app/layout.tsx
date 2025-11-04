import type { Metadata } from "next";
import "./globals.css";

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
        <body style={{
            background: 'linear-gradient(135deg, #ebf4ff 0%, #e0e7ff 100%)',
            minHeight: '100vh',
            margin: 0,
            padding: 0
        }}>
        {children}
        </body>
        </html>
    );
}