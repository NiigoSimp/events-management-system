import {MongoClient} from "mongodb";


const uri = "mongodb+srv://eventmanagementuser:zâzzazamuza@cluster0.qzzflwg.mongodb.net/?appName=Cluster0";

let db = null;

async function connectDB() {
    try {
        console.log('🔄 Connecting to MongoDB...');

        const client = new MongoClient(uri);
        await client.connect();

        db = client.db('EventManagement'); // Specify your database name
        console.log('Connected to MongoDB successfully!');

        return db;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db;
}

module.exports = { connectDB, getDB };