export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('event-management')

        // Find user
        const user = await db.collection('users').findOne({ email })
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        })

        // Return user data (without password) and token
        const response = NextResponse.json({
            success: true,
            data: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                token
            }
        })

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        )
    }
}