import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement');

        const revenueStats = await db.collection('registrations').aggregate([
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventId',
                    foreignField: '_id',
                    as: 'event'
                }
            },
            {
                $unwind: '$event'
            },
            {
                $match: {
                    paymentStatus: 'Completed'
                }
            },
            {
                $group: {
                    _id: {
                        eventId: '$eventId',
                        eventName: '$event.eventName'
                    },
                    totalRegistrations: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageTicketValue: { $avg: '$totalAmount' }
                }
            },
            {
                $sort: { totalRevenue: -1 }
            }
        ]).toArray();

        const result = revenueStats.map(stat => ({
            eventId: stat._id.eventId.toString(),
            eventName: stat._id.eventName,
            totalRegistrations: stat.totalRegistrations,
            totalRevenue: stat.totalRevenue,
            averageTicketValue: Math.round(stat.averageTicketValue * 100) / 100
        }));

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch revenue statistics'
        }, { status: 500 });
    }
}