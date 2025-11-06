import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('event-management')

        const [
            totalEvents,
            totalUsers,
            totalTickets,
            totalRevenue
        ] = await Promise.all([
            db.collection('events').countDocuments(),
            db.collection('users').countDocuments(),
            db.collection('tickets').countDocuments(),
            db.collection('tickets').aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ]).toArray()
        ])

        return NextResponse.json({
            success: true,
            data: {
                totalEvents,
                totalUsers,
                totalTickets,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        })

    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch admin stats'
        }, { status: 500 })
    }
}