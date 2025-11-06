
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        // For build compatibility, return mock data if no MONGODB_URI
        if (!process.env.MONGODB_URI) {
            console.log('MONGODB_URI not available - returning mock data');
            return NextResponse.json({
                success: true,
                data: {
                    totalRevenue: 0,
                    totalRegistrations: 0,
                    message: 'Build mode - mock data'
                }
            });
        }

        const client = await clientPromise;
        const db = client.db('event-management');

        // Fixed aggregation pipeline
        const revenueStats = await db.collection('registrations').aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' }, // Make sure this field exists
                    totalRegistrations: { $sum: 1 } // Count documents
                }
            }
        ]).toArray();

        const result = revenueStats[0] || {
            totalRevenue: 0,
            totalRegistrations: 0
        };

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'An unknown error occurred';

        console.error('Stats API Error:', error);

        // If it's a connection error during build, return empty data
        if (errorMessage.includes('MONGODB_URI') || errorMessage.includes('environment variable')) {
            return NextResponse.json({
                success: true,
                data: {
                    totalRevenue: 0,
                    totalRegistrations: 0,
                    message: 'Database not available'
                }
            });
        }

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