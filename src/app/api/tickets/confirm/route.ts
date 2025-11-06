import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function POST(request: Request) {
    try {
        const { ticketId } = await request.json()

        if (!ticketId) {
            return NextResponse.json({
                success: false,
                error: "Ticket ID is required"
            }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db('event-management')

        const result = await db.collection('tickets').updateOne(
            { _id: new ObjectId(ticketId) },
            {
                $set: {
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    updatedAt: new Date()
                }
            }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                error: "Ticket not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: {
                message: "Ticket confirmed successfully"
            }
        })

    } catch (error) {
        console.error('Ticket confirmation error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to confirm ticket'
        }, { status: 500 })
    }
}