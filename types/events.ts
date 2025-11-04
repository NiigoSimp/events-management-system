export interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    description: string;
    category: string;
    ticketPrice: number;
    status: string;
}

export type CreateEventData = Omit<Event, 'id'>;