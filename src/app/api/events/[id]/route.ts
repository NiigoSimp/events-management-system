import { NextResponse } from 'next/server';

// Mock data - same as above
const events = [
    {
        id: 1,
        name: "Tech Conference 2024",
        date: new Date('2024-03-15').toISOString(),
        location: "Hanoi, Vietnam",
        description: "Annual technology conference",
        category: "Technology",
        ticketPrice: 500000,
        status: "active"
    },
    {
        id: 2,
        name: "Music Festival",
        date: new Date('2024-04-20').toISOString(),
        location: "Ho Chi Minh City",
        description: "Spring music festival",
        category: "Music",
        ticketPrice: 200000,
        status: "active"
    }
];

// Define the type for route parameters
interface RouteParams {
    params: {
        id: string;
    };
}

// GET /api/events/[id]
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const event = events.find(e => e.id === parseInt(params.id));

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: event
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}

// PUT /api/events/[id]
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const body = await request.json();
        const eventIndex = events.findIndex(e => e.id === parseInt(params.id));

        if (eventIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        events[eventIndex] = {
            ...events[eventIndex],
            ...body,
            date: body.date ? new Date(body.date).toISOString() : events[eventIndex].date
        };

        return NextResponse.json({
            success: true,
            data: events[eventIndex]
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const eventIndex = events.findIndex(e => e.id === parseInt(params.id));

        if (eventIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            );
        }

        events.splice(eventIndex, 1);

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}