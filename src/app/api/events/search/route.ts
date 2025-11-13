import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const category = searchParams.get('category') || '';

        const client = await clientPromise;
        const db = client.db('eventsdb');

        let searchFilter: any = {};

        if (query) {
            searchFilter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ];
        }

        if (category) {
            searchFilter.category = category;
        }

        const events = await db
            .collection('events')
            .find(searchFilter)
            .sort({ date: 1 })
            .toArray();

        return NextResponse.json({
            success: true,
            events
        });

    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Search failed'
            },
            { status: 500 }
        );
    }
}