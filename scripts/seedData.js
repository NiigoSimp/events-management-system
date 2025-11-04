const { connectDB, getDB } = require('../config/database');

async function seedProperData() {
    try {
        await connectDB();
        const db = getDB();

        // Clear existing data
        await db.collection('events').deleteMany({});

        // Insert events with proper Date objects
        await db.collection('events').insertMany([
            {
                name: "Tech Conference 2024",
                date: new Date("2024-03-15T09:00:00Z"), // ✅ Proper Date object
                location: "Hanoi, Vietnam",
                description: "Annual technology conference featuring latest innovations",
                category: "Technology",
                ticketPrice: 500000,
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Music Festival Spring",
                date: new Date("2024-04-20T18:00:00Z"), // ✅ Proper Date object
                location: "Ho Chi Minh City",
                description: "Spring music festival with popular artists",
                category: "Music",
                ticketPrice: 200000,
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Business Workshop",
                date: new Date("2024-05-10T10:00:00Z"), // ✅ Proper Date object
                location: "Da Nang",
                description: "Business and entrepreneurship workshop",
                category: "Business",
                ticketPrice: 300000,
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log('✅ Sample data with proper dates created successfully!');

        // Verify the data
        const events = await db.collection('events').find({}).toArray();
        console.log('📅 Sample events:');
        events.forEach(event => {
            console.log(`- ${event.name}: ${event.date} (Type: ${typeof event.date})`);
        });

    } catch (error) {
        console.error('❌ Failed to seed data:', error);
    }
}

seedProperData();