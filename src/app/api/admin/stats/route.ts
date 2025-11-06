export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(); // This line is now used

        // Add your actual database operations here to use the 'db' variable
        // For example:
        const stats = await db.collection('your_collection').find().toArray();

        return NextResponse.json({ data: stats });
    } catch (error: unknown) {
        // Properly type the error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}