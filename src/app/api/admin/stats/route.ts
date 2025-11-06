export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement'); // Fixed typo

        // Your original aggregation logic would go here
        const revenueStats = await db.collection('registrations').aggregate([
            // Your aggregation pipeline
        ]).toArray();

        return NextResponse.json({
            success: true,
            data: revenueStats
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'An unknown error occurred';

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