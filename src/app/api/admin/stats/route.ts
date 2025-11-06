export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        // Check if MONGODB_URI is available
        if (!process.env.MONGODB_URI) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database configuration missing',
                    details: 'MONGODB_URI environment variable is not defined'
                },
                { status: 500 }
            );
        }

        const client = await clientPromise;
        const db = client.db('eventmanagement');

        // Example aggregation pipeline - adjust based on your needs
        const revenueStats = await db.collection('registrations').aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalRegistrations: { $count: {} }
                }
            }
        ]).toArray();

        return NextResponse.json({
            success: true,
            data: revenueStats[0] || { totalRevenue: 0, totalRegistrations: 0 }
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'An unknown error occurred';

        console.error('Stats API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch statistics',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}