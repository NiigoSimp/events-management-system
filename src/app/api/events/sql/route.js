import { NextResponse } from 'next/server';
import { SQLServices } from '../../../../../services/sqlServices';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        switch (action) {
            case 'upcoming':
                const events = await SQLServices.getUpcomingEvents();
                return NextResponse.json(events);

            case 'search':
                const category = searchParams.get('category');
                const location = searchParams.get('location');
                const searchResults = await SQLServices.searchEvents(category, location);
                return NextResponse.json(searchResults);

            case 'stats':
                const stats = await SQLServices.getEventsCountByStatus();
                return NextResponse.json(stats);

            case 'top-events':
                const limit = parseInt(searchParams.get('limit')) || 10;
                const topEvents = await SQLServices.getTopEvents(limit);
                return NextResponse.json(topEvents);

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('SQL API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, eventId } = body;

        switch (action) {
            case 'event-details':
                const eventDetails = await SQLServices.getEventDetails(eventId);
                return NextResponse.json(eventDetails);

            case 'ticket-types':
                const ticketTypes = await SQLServices.getEventTicketTypes(eventId);
                return NextResponse.json(ticketTypes);

            case 'sold-tickets':
                const soldTickets = await SQLServices.getSoldTicketsCount(eventId);
                return NextResponse.json({ eventId, soldTickets });

            case 'revenue':
                const revenue = await SQLServices.getEventRevenue(eventId);
                return NextResponse.json({ eventId, revenue });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('SQL API POST Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}