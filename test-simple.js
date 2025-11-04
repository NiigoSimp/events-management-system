// Simple test file - run this first
const { connectDB } = require('./config/database');

async function test() {
    try {
        console.log('🧪 Testing MongoDB connection...');
        const db = await connectDB();
        console.log('✅ Database connection successful!');

        // Try to list collections
        const collections = await db.listCollections().toArray();
        console.log('📁 Collections:', collections.map(c => c.name));

        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

test();