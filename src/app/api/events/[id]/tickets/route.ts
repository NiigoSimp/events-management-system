import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement');

        const event = await db.collection('events').findOne({
            _id: new ObjectId(params.id)
        });

        const ticketTypes = await db.collection('tickettypes').find({
            eventId: new ObjectId(params.id)
        }).toArray();

        const result = ticketTypes.map(ticket => ({
            eventName: event?.eventName || 'Unknown Event',
            ticketName: ticket.ticketName,
            price: ticket.price,
            quantity: ticket.quantity,
            sold: ticket.sold,
            availableTickets: ticket.quantity - ticket.sold
        })).filter(ticket => ticket.availableTickets > 0);

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch available tickets'
        }, { status: 500 });
    }
}