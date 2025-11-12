import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('event-management')

        // Find user by email
        const user = await db.collection('users').findOne({ email })
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            data: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            },
            token: 'mongo-auth-token' // You can implement proper JWT later
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        )
    }
}