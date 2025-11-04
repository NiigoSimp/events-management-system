import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function connectDB() {
    const client = new MongoClient(uri!);
    await client.connect();
    return client.db('eventmanagement');
}

// GET /api/events
export async function GET() {
    try {
        const db = await connectDB();
        const events = await db.collection('events')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const formattedEvents = events.map(event => ({
            id: event._id.toString(),
            name: event.name,
            date: event.date,
            location: event.location,
            description: event.description,
            category: event.category,
            ticketPrice: event.ticketPrice,
            status: event.status,
            createdAt: event.createdAt
        }));

        return NextResponse.json({
            success: true,
            data: formattedEvents
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch events', data: [] },
            { status: 500 }
        );
    }
}

// POST /api/events
export async function POST(request: Request) {
    try {
        const db = await connectDB();
        const body = await request.json();

        const newEvent = {
            name: body.name,
            date: new Date(body.date).toISOString(),
            location: body.location,
            description: body.description,
            category: body.category,
            ticketPrice: Number(body.ticketPrice),
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const result = await db.collection('events').insertOne(newEvent);

        return NextResponse.json({
            success: true,
            data: {
                id: result.insertedId.toString(),
                ...newEvent
            },
            message: 'Event created successfully'
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create event' },
            { status: 500 }
        );
    }
}