import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement');

        const stats = await db.collection('events').aggregate([
            { $match: { status: 'Active' } },
            { $group: {
                    _id: '$category',
                    eventCount: { $sum: 1 }
                }},
            { $sort: { eventCount: -1 } }
        ]).toArray();

        const result = stats.map(stat => ({
            category: stat._id,
            eventCount: stat.eventCount
        }));

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch category statistics'
        }, { status: 500 });
    }
}