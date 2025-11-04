import type { Metadata } from "next";

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
        <body style={{ margin: 0, padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        {children}
        </body>
        </html>
    );
}