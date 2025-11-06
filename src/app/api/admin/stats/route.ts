import { MongoClient } from 'mongodb'

export async function GET() {
    const uri = process.env.MONGODB_URI

    if (!uri) {
        return new Response(JSON.stringify({ error: 'MongoDB URI not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    try {
        const client = new MongoClient(uri)
        await client.connect()

        const db = client.db() // Add your database name if needed: client.db('your-db-name')

        // Replace with your actual stats queries
        const usersCount = await db.collection('users').countDocuments()
        const eventsCount = await db.collection('events').countDocuments()
        const registrationsCount = await db.collection('registrations').countDocuments()

        await client.close()

        // Return actual stats data
        const stats = {
            users: usersCount,
            events: eventsCount,
            registrations: registrationsCount,
            // Add any other stats you need
        }

        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Database error:', error)
        return new Response(JSON.stringify({ error: 'Database connection failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}