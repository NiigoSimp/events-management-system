import { ObjectId } from 'mongodb';

export interface Customer {
    _id?: ObjectId;
    name: string;
    email: string;
    phone: string;
    company?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const CustomerCollection = 'customers';