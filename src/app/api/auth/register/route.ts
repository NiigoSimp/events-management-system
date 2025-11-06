export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json()

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: 'Email, password, and name are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('event-management')

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 400 }
            )
        }

        // Create new user
        const hashedPassword = await hashPassword(password)
        const newUser = {
            email,
            password: hashedPassword,
            name,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await db.collection('users').insertOne(newUser)

        return NextResponse.json({
            success: true,
            data: {
                id: result.insertedId.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Registration failed' },
            { status: 500 }
        )
    }
}