import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('eventmanagement');
        const collections = await db.listCollections().toArray();
        return NextResponse.json({
            success: true,
            collections: collections.map(c => c.name),
            database: db.databaseName
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}