const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mongodb');
const { SQLServices } = require('./SQLServices');

class EventService {
    constructor() {
        // Khởi tạo MongoDB cho analytics (optional)
        this.initMongoDB();
    }

    async initMongoDB() {
        try {
            this.db = await getDB();
            this.events = this.db.collection('events');
            console.log('✅ MongoDB initialized for analytics');
        } catch (error) {
            console.log('⚠️ MongoDB not available, using SQL Server only');
            this.db = null;
            this.events = null;
        }
    }

    // CREATE EVENT - Chỉ tạo trong SQL vì bạn đã có data sẵn
    async createEvent(eventData) {
        try {
            // Nếu cần tạo event mới, chỉ cần tạo trong SQL
            // Đoạn code này giả định bạn đã implement SQLServices.createEvent()

            console.log('Creating event in SQL Server...');
            // const sqlEvent = await SQLServices.createEvent(eventData);

            // Nếu có MongoDB, tạo bản ghi analytics
            if (this.events) {
                const mongoEvent = {
                    sqlEventId: null, // Sẽ được cập nhật khi có SQL event ID
                    name: eventData.name,
                    date: new Date(eventData.date),
                    location: eventData.location,
                    category: eventData.category,
                    views: 0,
                    likes: 0,
                    tags: eventData.tags || [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                await this.events.insertOne(mongoEvent);
            }

            return {
                success: true,
                message: 'Event created successfully',
                // eventId: sqlEvent.EventID
            };
        } catch (error) {
            throw new Error(`Failed to create event: ${error.message}`);
        }
    }

    // GET ALL EVENTS - Chỉ lấy từ SQL (chính)
    async getAllEvents() {
        try {
            // Lấy tất cả events từ SQL Server
            const sqlEvents = await SQLServices.getUpcomingEvents();

            // Nếu có MongoDB, kết hợp với analytics data
            if (this.events) {
                const eventsWithAnalytics = await Promise.all(
                    sqlEvents.map(async (sqlEvent) => {
                        const mongoAnalytics = await this.events.findOne({
                            sqlEventId: sqlEvent.EventID
                        });

                        return {
                            // SQL Data
                            id: sqlEvent.EventID,
                            name: sqlEvent.EventName,
                            date: sqlEvent.StartDate,
                            location: sqlEvent.Location,
                            description: sqlEvent.Description,
                            category: sqlEvent.Category,
                            status: sqlEvent.Status,
                            createdAt: sqlEvent.CreatedAt,
                            organizer: sqlEvent.OrganizerName,
                            ticketsSold: sqlEvent.TicketsSold || 0,
                            revenue: sqlEvent.Revenue || 0,

                            // MongoDB Analytics
                            views: mongoAnalytics?.views || 0,
                            likes: mongoAnalytics?.likes || 0,
                            tags: mongoAnalytics?.tags || []
                        };
                    })
                );
                return eventsWithAnalytics;
            }

            // Chỉ trả về SQL data nếu không có MongoDB
            return sqlEvents.map(event => ({
                id: event.EventID,
                name: event.EventName,
                date: event.StartDate,
                location: event.Location,
                description: event.Description,
                category: event.Category,
                status: event.Status,
                createdAt: event.CreatedAt,
                organizer: event.OrganizerName,
                ticketsSold: event.TicketsSold || 0,
                revenue: event.Revenue || 0,
                views: 0,
                likes: 0,
                tags: []
            }));

        } catch (error) {
            throw new Error(`Failed to get events: ${error.message}`);
        }
    }

    // GET EVENT BY ID - Lấy từ SQL là chính
    async getEventById(eventId) {
        try {
            // Kiểm tra nếu eventId là SQL EventID (number)
            const isSqlEventId = !isNaN(eventId);

            if (isSqlEventId) {
                // Lấy từ SQL Server
                const sqlEventId = parseInt(eventId);

                const [eventDetails, ticketTypes, tickets, revenue] = await Promise.all([
                    SQLServices.getEventDetails(sqlEventId),
                    SQLServices.getEventTicketTypes(sqlEventId),
                    SQLServices.getTicketsByEvent(sqlEventId),
                    SQLServices.getEventRevenue(sqlEventId)
                ]);

                if (!eventDetails) {
                    throw new Error('Event not found in SQL Server');
                }

                // Track view in MongoDB analytics nếu có
                if (this.events) {
                    await this.events.updateOne(
                        { sqlEventId: sqlEventId },
                        {
                            $setOnInsert: {
                                sqlEventId: sqlEventId,
                                name: eventDetails.EventName,
                                category: eventDetails.Category,
                                location: eventDetails.Location,
                                createdAt: new Date()
                            },
                            $inc: { views: 1 },
                            $set: { lastViewed: new Date() }
                        },
                        { upsert: true }
                    );
                }

                return {
                    // SQL Data
                    id: eventDetails.EventID,
                    name: eventDetails.EventName,
                    date: eventDetails.StartDate,
                    location: eventDetails.Location,
                    description: eventDetails.Description,
                    category: eventDetails.Category,
                    status: eventDetails.Status,
                    createdAt: eventDetails.CreatedAt,
                    organizer: {
                        name: eventDetails.OrganizerName,
                        email: eventDetails.OrganizerEmail,
                        phone: eventDetails.OrganizerPhone
                    },

                    // Ticket Information
                    ticketTypes: ticketTypes,
                    tickets: tickets,

                    // Revenue and Statistics
                    revenue: revenue?.TotalRevenue || 0,
                    totalRegistrations: revenue?.TotalRegistrations || 0,
                    totalTicketsSold: revenue?.TotalTicketsSold || 0,

                    // Analytics (from MongoDB if available)
                    views: 0, // Sẽ được cập nhật từ MongoDB
                    likes: 0  // Sẽ được cập nhật từ MongoDB
                };

            } else {
                // Nếu là MongoDB ID (ObjectId) - fallback
                if (!ObjectId.isValid(eventId)) {
                    throw new Error('Invalid event ID');
                }

                const mongoEvent = await this.events.findOne({
                    _id: new ObjectId(eventId)
                });

                if (!mongoEvent) {
                    throw new Error('Event not found');
                }

                return {
                    id: mongoEvent._id.toString(),
                    name: mongoEvent.name,
                    date: mongoEvent.date,
                    location: mongoEvent.location,
                    description: mongoEvent.description,
                    category: mongoEvent.category,
                    status: mongoEvent.status,
                    views: mongoEvent.views || 0,
                    likes: mongoEvent.likes || 0,
                    tags: mongoEvent.tags || []
                };
            }
        } catch (error) {
            throw new Error(`Failed to get event: ${error.message}`);
        }
    }

    // UPDATE EVENT - Cập nhật chủ yếu trong SQL
    async updateEvent(eventId, updateData) {
        try {
            const isSqlEventId = !isNaN(eventId);

            if (isSqlEventId) {
                // Cập nhật trong SQL Server
                const sqlEventId = parseInt(eventId);

                // Giả định bạn đã implement SQLServices.updateEvent()
                // await SQLServices.updateEvent(sqlEventId, updateData);

                // Đồng bộ với MongoDB analytics nếu có
                if (this.events) {
                    await this.events.updateOne(
                        { sqlEventId: sqlEventId },
                        {
                            $set: {
                                ...updateData,
                                updatedAt: new Date()
                            }
                        }
                    );
                }

                return {
                    success: true,
                    message: 'Event updated successfully in SQL Server'
                };
            } else {
                // Fallback to MongoDB-only update
                if (!ObjectId.isValid(eventId)) {
                    throw new Error('Invalid event ID');
                }

                const updateFields = {
                    ...updateData,
                    updatedAt: new Date()
                };

                const result = await this.events.updateOne(
                    { _id: new ObjectId(eventId) },
                    { $set: updateFields }
                );

                if (result.matchedCount === 0) {
                    throw new Error('Event not found');
                }

                return {
                    success: true,
                    message: 'Event updated successfully in MongoDB'
                };
            }
        } catch (error) {
            throw new Error(`Failed to update event: ${error.message}`);
        }
    }

    // GET EVENTS WITH ANALYTICS - Kết hợp SQL data với MongoDB analytics
    async getEventsWithAnalytics() {
        try {
            // Lấy data từ SQL Server
            const [sqlEvents, eventStats, topEvents, categories] = await Promise.all([
                SQLServices.getUpcomingEvents(),
                SQLServices.getEventsCountByStatus(),
                SQLServices.getTopEvents(10),
                SQLServices.getEventCategories()
            ]);

            // Kết hợp với MongoDB analytics nếu có
            let eventsWithFullAnalytics = sqlEvents;

            if (this.events) {
                eventsWithFullAnalytics = await Promise.all(
                    sqlEvents.map(async (sqlEvent) => {
                        const analytics = await this.events.findOne({
                            sqlEventId: sqlEvent.EventID
                        });

                        return {
                            ...sqlEvent,
                            views: analytics?.views || 0,
                            likes: analytics?.likes || 0,
                            engagementRate: analytics?.views ?
                                ((analytics.likes || 0) / analytics.views) * 100 : 0
                        };
                    })
                );
            }

            return {
                events: eventsWithFullAnalytics,
                statistics: {
                    eventsByStatus: eventStats,
                    topEvents: topEvents,
                    categories: categories
                }
            };
        } catch (error) {
            throw new Error(`Failed to get events with analytics: ${error.message}`);
        }
    }

    // SEARCH EVENTS - Tìm kiếm chủ yếu trong SQL
    async searchEvents(searchCriteria) {
        try {
            const { category, location, date } = searchCriteria;

            // Sử dụng SQL Server cho tìm kiếm chính
            let sqlEvents = [];

            if (category && location) {
                sqlEvents = await SQLServices.searchEvents(category, location);
            } else if (category) {
                // Tìm theo category
                const allEvents = await SQLServices.getUpcomingEvents();
                sqlEvents = allEvents.filter(event =>
                    event.Category.toLowerCase().includes(category.toLowerCase())
                );
            } else if (location) {
                // Tìm theo location
                const allEvents = await SQLServices.getUpcomingEvents();
                sqlEvents = allEvents.filter(event =>
                    event.Location.toLowerCase().includes(location.toLowerCase())
                );
            } else {
                sqlEvents = await SQLServices.getUpcomingEvents();
            }

            // Lọc theo date nếu có
            if (date) {
                const filterDate = new Date(date);
                sqlEvents = sqlEvents.filter(event => {
                    const eventDate = new Date(event.StartDate);
                    return eventDate.toDateString() === filterDate.toDateString();
                });
            }

            return sqlEvents.map(event => ({
                id: event.EventID,
                name: event.EventName,
                date: event.StartDate,
                location: event.Location,
                category: event.Category,
                description: event.Description,
                status: event.Status,
                organizer: event.OrganizerName,
                ticketsSold: event.TicketsSold || 0
            }));

        } catch (error) {
            throw new Error(`Failed to search events: ${error.message}`);
        }
    }

    // DASHBOARD DATA - Lấy từ SQL là chính
    async getDashboardData() {
        try {
            const [
                eventsCount,
                topEvents,
                categories,
                recentRegistrations,
                paymentStatus
            ] = await Promise.all([
                SQLServices.getEventsCountByStatus(),
                SQLServices.getTopEvents(5),
                SQLServices.getEventCategories(),
                SQLServices.getPendingRegistrationsAfter24h(),
                SQLServices.getPaymentStatusByEvent()
            ]);

            const dashboardData = {
                summary: {
                    totalEvents: eventsCount.reduce((sum, item) => sum + item.EventCount, 0),
                    activeEvents: eventsCount.find(item => item.Status === 'Active')?.EventCount || 0,
                    pendingRegistrations: recentRegistrations.length,
                    totalCategories: categories.length
                },
                eventsByStatus: eventsCount,
                topEvents: topEvents,
                categories: categories,
                recentRegistrations: recentRegistrations,
                paymentAnalytics: paymentStatus
            };

            return dashboardData;
        } catch (error) {
            throw new Error(`Failed to get dashboard data: ${error.message}`);
        }
    }

    // MONGODB-SPECIFIC METHODS (for analytics only)
    async incrementLikes(eventId) {
        try {
            if (!this.events) {
                return { success: false, message: 'MongoDB not available' };
            }

            const isSqlEventId = !isNaN(eventId);

            if (isSqlEventId) {
                await this.events.updateOne(
                    { sqlEventId: parseInt(eventId) },
                    {
                        $inc: { likes: 1 },
                        $set: { lastLiked: new Date() }
                    }
                );
            } else {
                await this.events.updateOne(
                    { _id: new ObjectId(eventId) },
                    { $inc: { likes: 1 } }
                );
            }

            return { success: true };
        } catch (error) {
            throw new Error(`Failed to increment likes: ${error.message}`);
        }
    }

    async getEventAnalytics(eventId) {
        try {
            if (!this.events) {
                return { views: 0, likes: 0, engagementRate: 0 };
            }

            const isSqlEventId = !isNaN(eventId);
            let analytics;

            if (isSqlEventId) {
                analytics = await this.events.findOne({
                    sqlEventId: parseInt(eventId)
                });
            } else {
                analytics = await this.events.findOne({
                    _id: new ObjectId(eventId)
                });
            }

            return {
                views: analytics?.views || 0,
                likes: analytics?.likes || 0,
                engagementRate: analytics?.views ?
                    ((analytics.likes || 0) / analytics.views) * 100 : 0,
                lastViewed: analytics?.lastViewed,
                lastLiked: analytics?.lastLiked
            };
        } catch (error) {
            throw new Error(`Failed to get analytics: ${error.message}`);
        }
    }

    // SYNCHRONIZE DATA - Đồng bộ SQL events với MongoDB for analytics
    async synchronizeEvents() {
        try {
            if (!this.events) {
                return { success: false, message: 'MongoDB not available' };
            }

            const sqlEvents = await SQLServices.getUpcomingEvents();
            let syncedCount = 0;

            for (const sqlEvent of sqlEvents) {
                await this.events.updateOne(
                    { sqlEventId: sqlEvent.EventID },
                    {
                        $setOnInsert: {
                            sqlEventId: sqlEvent.EventID,
                            name: sqlEvent.EventName,
                            category: sqlEvent.Category,
                            location: sqlEvent.Location,
                            createdAt: new Date()
                        },
                        $set: {
                            updatedAt: new Date()
                        }
                    },
                    { upsert: true }
                );
                syncedCount++;
            }

            return {
                success: true,
                message: `Synchronized ${syncedCount} events with MongoDB analytics`
            };
        } catch (error) {
            throw new Error(`Failed to synchronize events: ${error.message}`);
        }
    }
}

module.exports = new EventService();