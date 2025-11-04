const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

class EventService {
    constructor() {
        this.db = getDB();
        this.events = this.db.collection('events');
    }

    // Create event with proper date handling
    async createEvent(eventData) {
        try {
            const event = {
                name: eventData.name,
                date: new Date(eventData.date), // ✅ Convert to Date object
                location: eventData.location,
                description: eventData.description,
                category: eventData.category,
                ticketPrice: parseFloat(eventData.ticketPrice),
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await this.events.insertOne(event);
            return {
                id: result.insertedId.toString(),
                ...event
            };
        } catch (error) {
            throw new Error(`Failed to create event: ${error.message}`);
        }
    }

    // Get all events with formatted dates
    async getAllEvents() {
        try {
            const events = await this.events.find({}).toArray();

            return events.map(event => ({
                id: event._id.toString(),
                name: event.name,
                date: event.date.toISOString(), // ✅ Convert to ISO string for frontend
                location: event.location,
                description: event.description,
                category: event.category,
                ticketPrice: event.ticketPrice,
                status: event.status,
                createdAt: event.createdAt.toISOString()
            }));
        } catch (error) {
            throw new Error(`Failed to get events: ${error.message}`);
        }
    }

    // Get event by ID with formatted date
    async getEventById(eventId) {
        try {
            if (!ObjectId.isValid(eventId)) {
                throw new Error('Invalid event ID');
            }

            const event = await this.events.findOne({
                _id: new ObjectId(eventId)
            });

            if (!event) {
                throw new Error('Event not found');
            }

            return {
                id: event._id.toString(),
                name: event.name,
                date: event.date.toISOString(), // ✅ Convert to ISO string
                location: event.location,
                description: event.description,
                category: event.category,
                ticketPrice: event.ticketPrice,
                status: event.status,
                createdAt: event.createdAt.toISOString()
            };
        } catch (error) {
            throw new Error(`Failed to get event: ${error.message}`);
        }
    }

    // Update event with proper date handling
    async updateEvent(eventId, updateData) {
        try {
            if (!ObjectId.isValid(eventId)) {
                throw new Error('Invalid event ID');
            }

            const updateFields = {
                ...updateData,
                updatedAt: new Date()
            };

            // Convert date string to Date object if provided
            if (updateData.date) {
                updateFields.date = new Date(updateData.date);
            }

            // Convert ticketPrice to number if provided
            if (updateData.ticketPrice) {
                updateFields.ticketPrice = parseFloat(updateData.ticketPrice);
            }

            const result = await this.events.updateOne(
                { _id: new ObjectId(eventId) },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                throw new Error('Event not found');
            }

            return { success: true };
        } catch (error) {
            throw new Error(`Failed to update event: ${error.message}`);
        }
    }
}

module.exports = new EventService();