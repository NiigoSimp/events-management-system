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
        <body className="antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {children}
        </body>
        </html>
    );
}