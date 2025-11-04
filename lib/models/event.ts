import { ObjectId } from 'mongodb';

export interface Event {
    _id?: ObjectId;
    eventName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
    category: string;
    status: 'Active' | 'Inactive' | 'Cancelled';
    organizerId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface Organizer {
    _id?: ObjectId;
    organizerName: string;
    email: string;
    phone: string;
    createdAt: Date;
}

export interface TicketType {
    _id?: ObjectId;
    eventId: ObjectId;
    ticketName: string;
    price: number;
    quantity: number;
    sold: number;
    createdAt: Date;
}

export interface Registration {
    _id?: ObjectId;
    customerId: ObjectId;
    eventId: ObjectId;
    ticketTypeId: ObjectId;
    quantity: number;
    totalAmount: number;
    paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
    registrationDate: Date;
}

export interface Customer {
    _id?: ObjectId;
    fullName: string;
    email: string;
    phone?: string;
    createdAt: Date;
}

export interface Payment {
    _id?: ObjectId;
    registrationId: ObjectId;
    paymentMethod: 'Credit Card' | 'Bank Transfer' | 'E-Wallet' | 'Cash';
    amount: number;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    transactionId?: string;
    paymentDate: Date;
}

export interface Ticket {
    _id?: ObjectId;
    registrationId: ObjectId;
    ticketCode: string;
    status: 'Active' | 'Used' | 'Cancelled';
    createdAt: Date;
}

export interface Feedback {
    _id?: ObjectId;
    eventId: ObjectId;
    customerId: ObjectId;
    rating: number; // 1-5
    comment?: string;
    createdAt: Date;
}