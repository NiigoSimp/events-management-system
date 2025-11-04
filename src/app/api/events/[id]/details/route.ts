import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement');

        const event = await db.collection('events').findOne({
            _id: new ObjectId(params.id)
        });

        if (!event) {
            return NextResponse.json({
                success: false,
                error: 'Event not found'
            }, { status: 404 });
        }

        const organizer = await db.collection('organizers').findOne({
            _id: event.organizerId
        });

        const result = {
            eventId: event._id.toString(),
            eventName: event.eventName,
            location: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
            description: event.description,
            category: event.category,
            organizerName: organizer?.organizerName || 'Unknown',
            organizerEmail: organizer?.email || '',
            organizerPhone: organizer?.phone || ''
        };

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch event details'
        }, { status: 500 });
    }
}