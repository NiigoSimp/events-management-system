import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface EventDocument {
    _id: ObjectId
    name: string
    date: string
    location: string
    description: string
    category: string
    ticketPrice: number
    maxAttendees: number  // Add this field
    status: string
    createdAt: Date
}

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('event-management')
        console.log('Fetching events from database...')

        const events = await db.collection<EventDocument>('events').find({}).sort({ date: 1 }).toArray()
        console.log(`Found ${events.length} events`)

        const serializedEvents = events.map(event => ({
            id: event._id.toString(),
            name: event.name,
            date: event.date,
            location: event.location,
            description: event.description,
            category: event.category,
            ticketPrice: event.ticketPrice,
            maxAttendees: event.maxAttendees,  // Add this field
            status: event.status,
            createdAt: event.createdAt.toISOString()
        }))

        return NextResponse.json({
            success: true,
            data: serializedEvents
        })
    } catch (error) {
        console.error('MongoDB error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch events from database'
        }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db('event-management')
        const body = await request.json()

        console.log('Received event data:', body)

        // Add maxAttendees to required fields validation
        if (!body.name || !body.date || !body.location || !body.maxAttendees) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: name, date, location, maxAttendees"
            }, { status: 400 })
        }

        let formattedDate = body.date;
        try {
            const date = new Date(body.date);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            formattedDate = date.toISOString();
        } catch (error) {
            return NextResponse.json({
                success: false,
                error: "Invalid date format. Use YYYY-MM-DD or ISO format"
            }, { status: 400 })
        }

        const ticketPrice = Number(body.ticketPrice);
        if (isNaN(ticketPrice)) {
            return NextResponse.json({
                success: false,
                error: "ticketPrice must be a valid number"
            }, { status: 400 })
        }

        // Validate maxAttendees
        const maxAttendees = Number(body.maxAttendees);
        if (isNaN(maxAttendees) || maxAttendees < 1) {
            return NextResponse.json({
                success: false,
                error: "maxAttendees must be a valid number greater than 0"
            }, { status: 400 })
        }

        // Add maxAttendees to new event object
        const newEvent = {
            name: body.name.trim(),
            date: formattedDate,
            location: body.location.trim(),
            description: body.description?.trim() || "",
            category: body.category?.trim() || "Technology",
            ticketPrice: ticketPrice,
            maxAttendees: maxAttendees,  // Add this field
            status: "active",
            createdAt: new Date()
        }

        console.log('Inserting event:', newEvent)
        const result = await db.collection('events').insertOne(newEvent)
        console.log('Insert result:', result)

        return NextResponse.json({
            success: true,
            data: {
                id: result.insertedId.toString(),
                ...newEvent,
                createdAt: newEvent.createdAt.toISOString()
            }
        }, { status: 201 })

    } catch (error) {
        console.error('MongoDB error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to create event in database'
        }, { status: 500 })
    }
}

export async function DELETE() {
    try {
        const client = await clientPromise
        const db = client.db('event-management')
        const result = await db.collection('events').deleteMany({})

        console.log(`Deleted ${result.deletedCount} events`)

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount
        })
    } catch (error) {
        console.error('MongoDB error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to delete events'
        }, { status: 500 })
    }
}