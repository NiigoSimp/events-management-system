import { getSQLPool, sql } from '../config/sqlServer';
interface EventData {
    OrganizerID: number;
    EventName: string;
    Location: string;
    StartDate: Date;
    EndDate: Date;
    Description: string;
    Category: string;
    Status?: string;
}

interface SQLEvent {
    EventID: number;
    EventName: string;
    Location: string;
    StartDate: string;
    EndDate: string;
    Description?: string;
    Category: string;
    Status?: string;
    OrganizerName: string;
    TicketsSold?: number;
    Revenue?: number;
}

export class SQLServices {
    // EVENT METHODS
    static async createEvent(eventData: EventData) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('OrganizerID', sql.Int, eventData.OrganizerID)
                .input('EventName', sql.NVarChar, eventData.EventName)
                .input('Location', sql.NVarChar, eventData.Location)
                .input('StartDate', sql.DateTime, eventData.StartDate)
                .input('EndDate', sql.DateTime, eventData.EndDate)
                .input('Description', sql.NVarChar, eventData.Description)
                .input('Category', sql.NVarChar, eventData.Category)
                .input('Status', sql.NVarChar, eventData.Status || 'Active')
                .query(`
                    INSERT INTO EVENT (OrganizerID, EventName, Location, StartDate, EndDate, Description, Category, Status)
                    OUTPUT INSERTED.*
                    VALUES (@OrganizerID, @EventName, @Location, @StartDate, @EndDate, @Description, @Category, @Status)
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Error in createEvent:', error);
            throw error;
        }
    }

    // 1. Lấy danh sách sự kiện sắp diễn ra
    static async getUpcomingEvents(limit: number = 10): Promise<SQLEvent[]> {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('Limit', sql.Int, limit)
                .query(`
                    SELECT TOP (@Limit)
                        e.EventID,
                        e.EventName,
                        e.Location,
                        e.StartDate,
                        e.EndDate,
                        e.Description,
                        e.Category,
                        e.Status,
                        e.CreatedAt,
                        o.OrganizerName,
                        ISNULL(SUM(tt.Sold), 0) as TicketsSold,
                        ISNULL(SUM(r.TotalAmount), 0) as Revenue
                    FROM EVENT e
                    JOIN ORGANIZER o ON e.OrganizerID = o.OrganizerID
                    LEFT JOIN TICKETTYPE tt ON e.EventID = tt.EventID
                    LEFT JOIN REGISTRATION r ON e.EventID = r.EventID AND r.PaymentStatus = 'Completed'
                    WHERE e.StartDate > GETDATE() AND e.Status = 'Active'
                    GROUP BY 
                        e.EventID, e.EventName, e.Location, e.StartDate, e.EndDate,
                        e.Description, e.Category, e.Status, e.CreatedAt, o.OrganizerName
                    ORDER BY e.StartDate ASC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getUpcomingEvents:', error);
            throw error;
        }
    }

    // 2. Tìm sự kiện theo thể loại và địa điểm
    static async searchEvents(category: string, location: string): Promise<SQLEvent[]> {
        try {
            const pool = await getSQLPool();
            let query = `
                SELECT 
                    e.EventID,
                    e.EventName,
                    e.Location,
                    e.StartDate,
                    e.EndDate,
                    e.Description,
                    e.Category,
                    e.Status,
                    o.OrganizerName,
                    ISNULL(SUM(tt.Sold), 0) as TicketsSold
                FROM EVENT e
                JOIN ORGANIZER o ON e.OrganizerID = o.OrganizerID
                LEFT JOIN TICKETTYPE tt ON e.EventID = tt.EventID
                WHERE e.Status = 'Active' AND e.StartDate > GETDATE()
            `;

            const request = pool.request();

            if (category) {
                query += ' AND e.Category LIKE @category';
                request.input('category', sql.NVarChar, `%${category}%`);
            }

            if (location) {
                query += ' AND e.Location LIKE @location';
                request.input('location', sql.NVarChar, `%${location}%`);
            }

            query += ' GROUP BY e.EventID, e.EventName, e.Location, e.StartDate, e.EndDate, e.Description, e.Category, e.Status, o.OrganizerName';
            query += ' ORDER BY e.StartDate ASC';

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error in searchEvents:', error);
            throw error;
        }
    }

    // Continue converting other methods...
    static async getEventDetails(eventId: number) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('EventID', sql.Int, eventId)
                .query(`
                    SELECT 
                        e.*,
                        o.OrganizerName,
                        o.Email as OrganizerEmail,
                        o.Phone as OrganizerPhone,
                        o.Address as OrganizerAddress
                    FROM EVENT e
                    JOIN ORGANIZER o ON e.OrganizerID = o.OrganizerID
                    WHERE e.EventID = @EventID
                `);

            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error in getEventDetails:', error);
            throw error;
        }
    }

    // Add proper types to all other methods...
    // 3. Đếm số lượng sự kiện theo trạng thái
    static async countEventsByStatus() {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .query(`
                    SELECT Status, COUNT(*) as EventCount
                    FROM EVENT
                    GROUP BY Status
                    ORDER BY EventCount DESC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in countEventsByStatus:', error);
            throw error;
        }
    }
}
