import { ObjectId } from 'mongodb'

export interface User {
    _id?: ObjectId
    email: string
    password: string  // We'll hash this
    name: string
    role: 'user' | 'admin'
    createdAt: Date
    updatedAt: Date
}