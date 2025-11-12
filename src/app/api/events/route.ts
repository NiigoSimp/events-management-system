import { NextRequest, NextResponse } from 'next/server'
import { SQLServices } from '../../../../services/sqlServices'

// Define types for the event object
interface SQLEvent {
    EventID: number;
    EventName: string;
    StartDate: string;
    Location: string;
    Description?: string;
    Category: string;
    Status?: string;
    OrganizerName: string;
    TicketsSold?: number;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const location = searchParams.get('location')
        const query = searchParams.get('q')

        console.log('Searching events in SQL Server:', { category, location, query })

        let events: SQLEvent[] = []

        // Fix: Use explicit type checking and type assertions
        const hasCategory = category !== null && category !== undefined && category !== ''
        const hasLocation = location !== null && location !== undefined && location !== ''
        const hasQuery = query !== null && query !== undefined && query !== ''

        if (hasCategory && hasLocation) {
            events = await SQLServices.searchEvents(category!, location!)
        } else if (hasCategory) {
            const allEvents = await SQLServices.getUpcomingEvents()
            events = allEvents.filter((event: SQLEvent) =>
                event.Category.toLowerCase().includes(category!.toLowerCase())
            )
        } else if (hasLocation) {
            const allEvents = await SQLServices.getUpcomingEvents()
            events = allEvents.filter((event: SQLEvent) =>
                event.Location.toLowerCase().includes(location!.toLowerCase())
            )
        } else if (hasQuery) {
            const allEvents = await SQLServices.getUpcomingEvents()
            events = allEvents.filter((event: SQLEvent) =>
                event.EventName.toLowerCase().includes(query!.toLowerCase()) ||
                (event.Description && event.Description.toLowerCase().includes(query!.toLowerCase()))
            )
        } else {
            events = await SQLServices.getUpcomingEvents()
        }

        const serializedEvents = events.map(event => ({
            id: event.EventID.toString(),
            name: event.EventName,
            date: event.StartDate,
            location: event.Location,
            description: event.Description || "",
            category: event.Category || "Technology",
            status: event.Status?.toLowerCase() || "active",
            organizer: event.OrganizerName,
            ticketsSold: event.TicketsSold || 0
        }))

        return NextResponse.json({
            success: true,
            data: serializedEvents,
            count: serializedEvents.length
        })

    } catch (error) {
        console.error('SQL Server error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to search events'
        }, { status: 500 })
    }
}