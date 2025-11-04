import { NextResponse } from 'next/server';

// Mock data - this will work without any database
let mockEvents = [
    {
        id: 1,
        name: "Tech Conference 2024",
        date: "2024-12-15T10:00:00",
        location: "Hanoi",
        description: "Annual technology conference featuring the latest in tech innovation",
        category: "Technology",
        ticketPrice: 100,
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Music Festival",
        date: "2024-11-20T18:00:00",
        location: "Ho Chi Minh City",
        description: "Live music performance with popular artists",
        category: "Music",
        ticketPrice: 50,
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "Business Workshop",
        date: "2024-10-05T09:00:00",
        location: "Da Nang",
        description: "Learn business strategies from industry experts",
        category: "Business",
        ticketPrice: 75,
        status: "active",
        createdAt: new Date().toISOString()
    }
];

export async function GET() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return NextResponse.json({
            success: true,
            data: mockEvents
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Failed to fetch events"
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.date || !body.location) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: name, date, location"
            }, { status: 400 });
        }

        // Create new event
        const newEvent = {
            id: Date.now(), // Simple ID generation
            name: body.name,
            date: body.date,
            location: body.location,
            description: body.description || "",
            category: body.category || "Technology",
            ticketPrice: body.ticketPrice || 0,
            status: "active",
            createdAt: new Date().toISOString()
        };

        // Add to mock events array
        mockEvents.push(newEvent);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        return NextResponse.json({
            success: true,
            data: newEvent
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Failed to create event"
        }, { status: 500 });
    }
}