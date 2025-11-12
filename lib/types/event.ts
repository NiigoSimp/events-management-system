export interface Event {
    _id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    organizer: string;
    totalTickets: number;
    availableTickets: number;
    price: number;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
}

export interface Ticket {
    _id: string;
    eventId: string;
    customerId: string;
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    purchaseDate: Date;
}

export interface EventStats {
    eventId: string;
    eventTitle: string;
    ticketsSold: number;
    totalRevenue: number;
    availableTickets: number;
}

export interface CategoryStats {
    category: string;
    eventCount: number;
    totalTickets: number;
    ticketsSold: number;
}