import { NextRequest, NextResponse } from 'next/server'


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id

        // Validate eventId
        if (!eventId) {
            return NextResponse.json(
                { success: false, error: 'Event ID is required' },
                { status: 400 }
            );
        }

        const eventsResponse = await fetch(`${request.nextUrl.origin}/api/events`);

        if (!eventsResponse.ok) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch events from API' },
                { status: 500 }
            );
        }

        const eventsData = await eventsResponse.json();

        if (!eventsData.success) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch events' },
                { status: 500 }
            );
        }

        const event = eventsData.data.find((event: any) => event.id === eventId);

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

    } catch (error: unknown) {
        console.error('Error fetching event:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : 'An unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch event',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}