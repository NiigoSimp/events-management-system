// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../components/lib/auth/AuthContext';
import Navigation from '../components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Event Management System',
    description: 'Manage and discover amazing events',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}