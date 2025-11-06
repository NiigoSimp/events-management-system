import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

// 1. Lấy danh sách sự kiện sắp diễn ra
export async function getUpcomingEvents(limit: number = 10) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('events').find({
        date: { $gte: new Date() },
        status: 'active'
    }).sort({ date: 1 }).limit(limit).toArray()
}

// 2. Tìm sự kiện theo thể loại và địa điểm
export async function findEventsByCategoryAndLocation(category: string, location: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('events').find({
        category: category,
        location: { $regex: location, $options: 'i' },
        status: 'active'
    }).sort({ date: 1 }).toArray()
}

// 3. Đếm số lượng sự kiện theo trạng thái
export async function countEventsByStatus() {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('events').aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]).toArray()
}

// 4. Lấy thông tin người dùng và số vé đã đăng ký
export async function getUserWithTicketCount(userId: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('users').aggregate([
        { $match: { _id: new ObjectId(userId) } },
        {
            $lookup: {
                from: 'tickets',
                localField: '_id',
                foreignField: 'userId',
                as: 'tickets'
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                role: 1,
                ticketCount: { $size: '$tickets' },
                tickets: 1
            }
        }
    ]).toArray()
}

// 5. Tìm người dùng theo email và vai trò
export async function findUsersByEmailAndRole(email: string, role?: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    const query: any = { email: { $regex: email, $options: 'i' } }
    if (role) query.role = role

    return await db.collection('users').find(query).toArray()
}

// 6. Đếm số vé đã bán cho một sự kiện
export async function countTicketsForEvent(eventId: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('tickets').countDocuments({
        eventId: new ObjectId(eventId),
        status: { $in: ['confirmed', 'pending'] }
    })
}

// 7. Lấy danh sách vé theo sự kiện với thông tin người đăng ký
export async function getTicketsWithUserInfo(eventId: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('tickets').aggregate([
        { $match: { eventId: new ObjectId(eventId) } },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: '$userInfo'
        },
        {
            $project: {
                ticketType: 1,
                price: 1,
                status: 1,
                paymentStatus: 1,
                createdAt: 1,
                userName: '$userInfo.name',
                userEmail: '$userInfo.email'
            }
        }
    ]).toArray()
}

// 8. Kiểm tra vé còn trống cho sự kiện
export async function checkEventAvailability(eventId: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) })
    if (!event) throw new Error('Event not found')

    const soldTickets = await db.collection('tickets').countDocuments({
        eventId: new ObjectId(eventId),
        status: { $in: ['confirmed', 'pending'] }
    })

    const availableTickets = event.maxAttendees - soldTickets

    return {
        eventName: event.name,
        maxAttendees: event.maxAttendees,
        soldTickets,
        availableTickets,
        isAvailable: availableTickets > 0
    }
}

// 9. Doanh thu theo sự kiện
export async function getRevenueByEvent() {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('tickets').aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
            $group: {
                _id: '$eventId',
                totalRevenue: { $sum: '$price' },
                ticketCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: '_id',
                as: 'eventInfo'
            }
        },
        {
            $unwind: '$eventInfo'
        },
        {
            $project: {
                eventName: '$eventInfo.name',
                totalRevenue: 1,
                ticketCount: 1
            }
        },
        { $sort: { totalRevenue: -1 } }
    ]).toArray()
}

// 10. Top sự kiện được đăng ký nhiều nhất
export async function getTopEventsByRegistration(limit: number = 5) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('tickets').aggregate([
        { $match: { status: { $in: ['confirmed', 'pending'] } } },
        {
            $group: {
                _id: '$eventId',
                registrationCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: '_id',
                as: 'eventInfo'
            }
        },
        {
            $unwind: '$eventInfo'
        },
        {
            $project: {
                eventName: '$eventInfo.name',
                registrationCount: 1,
                date: '$eventInfo.date'
            }
        },
        { $sort: { registrationCount: -1 } },
        { $limit: limit }
    ]).toArray()
}

// 11. Lấy sự kiện trong khoảng thời gian
export async function getEventsInDateRange(startDate: Date, endDate: Date) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('events').find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: 1 }).toArray()
}

// 12. Sự kiện sắp diễn ra trong 7 ngày tới
export async function getEventsInNext7Days() {
    const client = await clientPromise
    const db = client.db('event-management')

    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return await db.collection('events').find({
        date: {
            $gte: today,
            $lte: nextWeek
        },
        status: 'active'
    }).sort({ date: 1 }).toArray()
}

// 13. Tổng hợp trạng thái thanh toán theo sự kiện
export async function getPaymentStatusByEvent(eventId: string) {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('tickets').aggregate([
        { $match: { eventId: new ObjectId(eventId) } },
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$price' }
            }
        }
    ]).toArray()
}

// 14. Lấy vé chưa thanh toán sau 24 giờ
export async function getUnpaidTicketsAfter24h() {
    const client = await clientPromise
    const db = client.db('event-management')

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return await db.collection('tickets').aggregate([
        {
            $match: {
                paymentStatus: 'pending',
                createdAt: { $lte: twentyFourHoursAgo }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $lookup: {
                from: 'events',
                localField: 'eventId',
                foreignField: '_id',
                as: 'eventInfo'
            }
        },
        {
            $unwind: '$userInfo'
        },
        {
            $unwind: '$eventInfo'
        },
        {
            $project: {
                ticketId: '$_id',
                userName: '$userInfo.name',
                userEmail: '$userInfo.email',
                eventName: '$eventInfo.name',
                eventDate: '$eventInfo.date',
                price: 1,
                createdAt: 1
            }
        }
    ]).toArray()
}

// 15. Lấy danh mục sự kiện và số lượng sự kiện
export async function getEventCategoriesWithCount() {
    const client = await clientPromise
    const db = client.db('event-management')

    return await db.collection('events').aggregate([
        {
            $group: {
                _id: '$category',
                eventCount: { $sum: 1 },
                upcomingEvents: {
                    $sum: {
                        $cond: [{ $gte: ['$date', new Date()] }, 1, 0]
                    }
                }
            }
        },
        { $sort: { eventCount: -1 } }
    ]).toArray()
}