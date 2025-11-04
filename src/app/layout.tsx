import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

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
        <body
            className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}
        >
        {children}
        </body>
        </html>
    );
}