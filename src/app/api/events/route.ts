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
    status: string
    createdAt: Date
}

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('eventmanagement')
        const events = await db.collection<EventDocument>('events').find({}).sort({ date: 1 }).toArray()

        // Convert MongoDB _id to id and make serializable
        const serializedEvents = events.map(event => ({
            id: event._id.toString(),
            name: event.name,
            date: event.date,
            location: event.location,
            description: event.description,
            category: event.category,
            ticketPrice: event.ticketPrice,
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
        const db = client.db('eventmanagement')
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.date || !body.location) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: name, date, location"
            }, { status: 400 })
        }

        // Create new event document
        const newEvent = {
            name: body.name,
            date: body.date,
            location: body.location,
            description: body.description || "",
            category: body.category || "Technology",
            ticketPrice: body.ticketPrice || 0,
            status: "active",
            createdAt: new Date()
        }

        const result = await db.collection('events').insertOne(newEvent)

        return NextResponse.json({
            success: true,
            data: {
                id: result.insertedId.toString(),
                ...newEvent
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