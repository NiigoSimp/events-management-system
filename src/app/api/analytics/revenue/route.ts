import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('eventsdb'); // Make sure this matches your database name

        // Get revenue data - adjust this query based on your actual data structure
        const revenueData = await db
            .collection('events') // or 'payments', 'tickets' etc.
            .find({})
            .toArray();

        return NextResponse.json({
            success: true,
            data: revenueData
        });

    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch revenue data'
            },
            { status: 500 }
        );
    }
}