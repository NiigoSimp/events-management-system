import { NextResponse } from 'next/server'
import * as queries from '@/lib/queries'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const queryType = searchParams.get('type')

    try {
        let result

        switch (queryType) {
            case 'upcoming-events':
                result = await queries.getUpcomingEvents()
                break

            case 'events-by-category-location':
                const category = searchParams.get('category') || 'Technology'
                const location = searchParams.get('location') || ''
                result = await queries.findEventsByCategoryAndLocation(category, location)
                break

            case 'event-status-count':
                result = await queries.countEventsByStatus()
                break

            case 'user-ticket-count':
                const userId = searchParams.get('userId')
                if (!userId) throw new Error('User ID required')
                result = await queries.getUserWithTicketCount(userId)
                break

            case 'events-next-7-days':
                result = await queries.getEventsInNext7Days()
                break

            case 'event-categories':
                result = await queries.getEventCategoriesWithCount()
                break

            case 'top-events':
                result = await queries.getTopEventsByRegistration()
                break

            default:
                return NextResponse.json({ error: 'Invalid query type' }, { status: 400 })
        }

        return NextResponse.json({ success: true, data: result })

    } catch (error) {
        console.error('Query error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}