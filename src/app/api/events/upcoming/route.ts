import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement');

        const events = await db.collection('events').find({
            startDate: { $gte: new Date() },
            status: 'Active'
        }).sort({ startDate: 1 }).toArray();

        const serializedEvents = events.map(event => ({
            eventId: event._id.toString(),
            eventName: event.eventName,
            location: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
            category: event.category,
            status: event.status
        }));

        return NextResponse.json({
            success: true,
            data: serializedEvents
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch upcoming events'
        }, { status: 500 });
    }
}