import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id

        // Here you would typically fetch the event from your database
        // For now, we'll simulate fetching an event
        // Replace this with your actual database query

        // Example: Fetch from your events API or database
        const eventsResponse = await fetch(`${request.nextUrl.origin}/api/events`)
        const eventsData = await eventsResponse.json()

        if (!eventsData.success) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch events' },
                { status: 500 }
            )
        }

        const event = eventsData.data.find((event: any) => event.id === eventId)

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: event
        })

    } catch (error) {
        console.error('Error fetching event:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event' },
            { status: 500 }
        )
    }
}