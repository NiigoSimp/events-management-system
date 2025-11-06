import { ObjectId } from 'mongodb'

export interface Ticket {
    _id?: ObjectId
    eventId: ObjectId
    userId: ObjectId
    ticketType: string
    price: number
    status: 'pending' | 'confirmed' | 'cancelled'
    paymentStatus: 'pending' | 'paid' | 'refunded'
    createdAt: Date
    updatedAt: Date
}

export interface Event {
    _id?: ObjectId
    name: string
    date: Date
    location: string
    description: string
    category: string
    ticketPrice: number
    status: 'active' | 'cancelled' | 'completed'
    maxAttendees: number
    createdAt: Date
    updatedAt: Date
}

export interface User {
    _id?: ObjectId
    email: string
    password: string
    name: string
    role: 'user' | 'admin'
    phone?: string
    createdAt: Date
    updatedAt: Date
}