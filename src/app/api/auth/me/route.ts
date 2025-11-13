import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils'; // Adjust path
import { findUserByEmail } from '@/lib/queries'; // Adjust path

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { message: 'No token provided' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const user = await findUserByEmail(decoded.email);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json(
            { message: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}