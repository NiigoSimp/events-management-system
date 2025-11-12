import { NextResponse } from 'next/server';
import { executeQuery } from '@/services/sqlServer';

export async function GET() {
    try {
        const result = await executeQuery('SELECT @@VERSION as version');

        return NextResponse.json({
            success: true,
            database: 'SQL Server',
            version: result[0].version,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                database: 'SQL Server',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}