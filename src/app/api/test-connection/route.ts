import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
    try {
        console.log('Testing MongoDB connection...')
        const client = await clientPromise
        console.log('Connected to MongoDB')

        const db = client.db('event-management')
        console.log('Using database:', db.databaseName)

        // Try to insert a test document
        const testDoc = {
            name: 'Test Event',
            date: new Date().toISOString(),
            location: 'Test Location',
            description: 'This is a test document',
            category: 'Test',
            ticketPrice: 0,
            status: 'active',
            createdAt: new Date()
        }

        console.log('Inserting test document...')
        const result = await db.collection('events').insertOne(testDoc)
        console.log('Insert result:', result)

        const count = await db.collection('events').countDocuments()
        console.log('Total documents:', count)

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            insertedId: result.insertedId.toString(),
            totalDocuments: count,
            database: db.databaseName
        })

    } catch (error) {
        console.error('MongoDB connection failed:', error)
        return NextResponse.json({
            success: false,
            error: String(error),
            message: 'Database connection failed'
        }, { status: 500 })
    }
}