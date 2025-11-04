import { ObjectId } from 'mongodb';

export interface Event {
    _id?: ObjectId;
    title: string;
    description: string;
    location: string;
    date: Date;
    customerId: ObjectId;
    employeeId: ObjectId;
    status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export const EventCollection = 'events';