import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        const { eventId, quantity, customerName, customerEmail, customerPhone, totalAmount } = body

        if (!eventId || !quantity || !customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }
        const ticket = {
            id: `TKT-${Date.now()}`,
            eventId,
            quantity,
            customerName,
            customerEmail,
            customerPhone,
            totalAmount,
            purchaseDate: new Date().toISOString(),
            status: 'confirmed'
        }

        console.log('Ticket created:', ticket)

        return NextResponse.json({
            success: true,
            data: ticket,
            message: 'Ticket purchased successfully'
        })

    } catch (error) {
        console.error('Error creating ticket:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create ticket' },
            { status: 500 }
        )
    }
}