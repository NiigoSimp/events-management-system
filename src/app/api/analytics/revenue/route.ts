import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';  // Correct path

export async function GET() {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        return NextResponse.json(
            {
                success: false,
                error: 'Database configuration missing',
                message: 'MONGODB_URI environment variable is not defined'
            },
            { status: 500 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'event-management');

        // Your analytics query here - using mock data for now
        const revenueData = await db
            .collection('events')
            .find({})
            .limit(10)
            .toArray();

        return NextResponse.json({
            success: true,
            data: revenueData
        });

    } catch (error: any) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch revenue data',
                details: error.message
            },
            { status: 500 }
        );
    }
}