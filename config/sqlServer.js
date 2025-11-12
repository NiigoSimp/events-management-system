const { getSQLPool, sql } = require('../config/sqlServer');

class SQLServices {

    // 1. Lấy danh sách sự kiện sắp diễn ra
    static async getUpcomingEvents() {
        const pool = getSQLPool();
        const result = await pool.request().query(`
      SELECT 
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
        o.Email as OrganizerEmail,
        (SELECT SUM(tt.Sold) FROM TICKETTYPE tt WHERE tt.EventID = e.EventID) as TicketsSold,
        (SELECT SUM(r.TotalAmount) FROM REGISTRATION r WHERE r.EventID = e.EventID AND r.PaymentStatus = 'Completed') as Revenue
      FROM EVENT e
      LEFT JOIN ORGANIZER o ON e.OrganizerID = o.OrganizerID
      WHERE e.StartDate > GETDATE() AND e.Status = 'Active'
      ORDER BY e.StartDate ASC
    `);
        return result.recordset;
    }

    // 2. Tìm sự kiện theo thể loại và địa điểm
    static async searchEvents(category, location) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('category', sql.NVarChar, category)
            .input('location', sql.NVarChar, `%${location}%`)
            .query(`
        SELECT 
          EventID, EventName, Location, StartDate, EndDate, 
          Category, Status, Description
        FROM EVENT 
        WHERE Category = @category 
          AND Location LIKE @location
          AND Status = 'Active'
      `);
        return result.recordset;
    }

    // 3. Đếm số lượng sự kiện theo trạng thái
    static async getEventsCountByStatus() {
        const pool = getSQLPool();
        const result = await pool.request().query(`
      SELECT Status, COUNT(*) as EventCount
      FROM EVENT
      GROUP BY Status
    `);
        return result.recordset;
    }

    // 4. Lấy thông tin người dùng và số vé đã đăng ký
    static async getCustomersWithRegistrations() {
        const pool = getSQLPool();
        const result = await pool.request().query(`
      SELECT 
        c.CustomerID,
        c.FullName,
        c.Email,
        c.Phone,
        c.CreatedAt,
        COUNT(r.RegistrationID) as TotalRegistrations,
        SUM(r.Quantity) as TotalTickets,
        SUM(CASE WHEN r.PaymentStatus = 'Completed' THEN r.TotalAmount ELSE 0 END) as TotalSpent
      FROM CUSTOMER c
      LEFT JOIN REGISTRATION r ON c.CustomerID = r.CustomerID
      GROUP BY c.CustomerID, c.FullName, c.Email, c.Phone, c.CreatedAt
      ORDER BY TotalRegistrations DESC
    `);
        return result.recordset;
    }

    // 5. Tìm người dùng theo email
    static async findCustomerByEmail(email) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM CUSTOMER WHERE Email = @email');
        return result.recordset[0];
    }

    // 6. Đếm số vé đã bán cho một sự kiện
    static async getSoldTicketsCount(eventId) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('eventId', sql.Int, eventId)
            .query(`
        SELECT SUM(tt.Sold) as TotalTicketsSold
        FROM TICKETTYPE tt
        WHERE tt.EventID = @eventId
      `);
        return result.recordset[0]?.TotalTicketsSold || 0;
    }

    // 7. Lấy danh sách vé theo sự kiện với thông tin người đăng ký
    static async getTicketsByEvent(eventId) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('eventId', sql.Int, eventId)
            .query(`
        SELECT 
          t.TicketID,
          t.TicketCode,
          c.FullName,
          c.Email,
          c.Phone,
          e.EventName,
          tt.TicketName,
          r.Quantity,
          r.TotalAmount,
          r.RegistrationDate,
          r.PaymentStatus,
          t.IsCheckedIn,
          t.CheckInAt
        FROM TICKET t
        JOIN REGISTRATION r ON t.RegistrationID = r.RegistrationID
        JOIN CUSTOMER c ON r.CustomerID = c.CustomerID
        JOIN EVENT e ON r.EventID = e.EventID
        JOIN TICKETTYPE tt ON t.TicketTypeID = tt.TicketTypeID
        WHERE e.EventID = @eventId
        ORDER BY r.RegistrationDate DESC
      `);
        return result.recordset;
    }

    // 8. Kiểm tra vé còn trống cho một sự kiện
    static async getTicketAvailability(eventId) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('eventId', sql.Int, eventId)
            .query(`
        SELECT 
          tt.TicketTypeID,
          tt.TicketName,
          tt.Price,
          tt.Quantity,
          tt.Sold,
          (tt.Quantity - tt.Sold) as Available,
          tt.Description
        FROM TICKETTYPE tt
        WHERE tt.EventID = @eventId
          AND (tt.Quantity - tt.Sold) > 0
        ORDER BY tt.Price ASC
      `);
        return result.recordset;
    }

    // 9. Doanh thu theo sự kiện
    static async getEventRevenue(eventId) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('eventId', sql.Int, eventId)
            .query(`
        SELECT 
          SUM(r.TotalAmount) as TotalRevenue,
          COUNT(r.RegistrationID) as TotalRegistrations,
          SUM(r.Quantity) as TotalTicketsSold
        FROM REGISTRATION r
        WHERE r.EventID = @eventId AND r.PaymentStatus = 'Completed'
      `);
        return result.recordset[0];
    }

    // 10. Top sự kiện được đăng ký nhiều nhất
    static async getTopEvents(limit = 10) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('limit', sql.Int, limit)
            .query(`
        SELECT TOP (@limit)
          e.EventID,
          e.EventName,
          e.Category,
          e.Location,
          COUNT(r.RegistrationID) as RegistrationCount,
          SUM(r.Quantity) as TotalTicketsSold,
          SUM(r.TotalAmount) as TotalRevenue
        FROM EVENT e
        LEFT JOIN REGISTRATION r ON e.EventID = r.EventID AND r.PaymentStatus = 'Completed'
        GROUP BY e.EventID, e.EventName, e.Category, e.Location
        ORDER BY TotalTicketsSold DESC
      `);
        return result.recordset;
    }

    // 11. Lấy sự kiện trong khoảng thời gian
    static async getEventsByDateRange(startDate, endDate) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('startDate', sql.DateTime, startDate)
            .input('endDate', sql.DateTime, endDate)
            .query(`
        SELECT 
          EventID, EventName, Location, StartDate, EndDate, 
          Category, Status, Description
        FROM EVENT
        WHERE StartDate BETWEEN @startDate AND @endDate
        ORDER BY StartDate ASC
      `);
        return result.recordset;
    }

    // 12. Sự kiện sắp diễn ra trong 7 ngày tới
    static async getEventsNext7Days() {
        const pool = getSQLPool();
        const result = await pool.request().query(`
      SELECT 
        EventID, EventName, Location, StartDate, EndDate, 
        Category, Status, Description
      FROM EVENT
      WHERE StartDate BETWEEN GETDATE() AND DATEADD(day, 7, GETDATE())
        AND Status = 'Active'
      ORDER BY StartDate ASC
    `);
        return result.recordset;
    }

    // 13. Tổng hợp trạng thái thanh toán theo sự kiện
    static async getPaymentStatusByEvent(eventId = null) {
        const pool = getSQLPool();

        let query = `
      SELECT 
        e.EventID,
        e.EventName,
        r.PaymentStatus,
        COUNT(r.RegistrationID) as RegistrationCount,
        SUM(r.Quantity) as TicketCount,
        SUM(r.TotalAmount) as TotalAmount
      FROM EVENT e
      JOIN REGISTRATION r ON e.EventID = r.EventID
    `;

        if (eventId) {
            query += ` WHERE e.EventID = @eventId`;
        }

        query += ` GROUP BY e.EventID, e.EventName, r.PaymentStatus ORDER BY e.EventID, r.PaymentStatus`;

        const request = pool.request();
        if (eventId) {
            request.input('eventId', sql.Int, eventId);
        }

        const result = await request.query(query);
        return result.recordset;
    }

    // 14. Lấy đăng ký chưa thanh toán sau 24 giờ
    static async getPendingRegistrationsAfter24h() {
        const pool = getSQLPool();
        const result = await pool.request().query(`
      SELECT 
        r.RegistrationID,
        c.FullName,
        c.Email,
        e.EventName,
        r.Quantity,
        r.TotalAmount,
        r.RegistrationDate,
        r.PaymentStatus
      FROM REGISTRATION r
      JOIN CUSTOMER c ON r.CustomerID = c.CustomerID
      JOIN EVENT e ON r.EventID = e.EventID
      WHERE r.PaymentStatus = 'Pending'
        AND r.RegistrationDate < DATEADD(hour, -24, GETDATE())
      ORDER BY r.RegistrationDate ASC
    `);
        return result.recordset;
    }

    // 15. Lấy danh mục sự kiện và số lượng sự kiện
    static async getEventCategories() {
        const pool = getSQLPool();
        const result = await pool.request().query(`
      SELECT 
        Category,
        COUNT(*) as EventCount,
        SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) as ActiveEvents,
        SUM(CASE WHEN StartDate > GETDATE() THEN 1 ELSE 0 END) as UpcomingEvents
      FROM EVENT
      GROUP BY Category
      ORDER BY EventCount DESC
    `);
        return result.recordset;
    }

    // 16. Lấy chi tiết sự kiện
    static async getEventDetails(eventId) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('eventId', sql.Int, eventId)
            .query(`
        SELECT 
          e.*,
          o.OrganizerName,
          o.Email as OrganizerEmail,
          o.Phone as OrganizerPhone,
          o.Address as OrganizerAddress,
          (SELECT SUM(tt.Quantity) FROM TICKETTYPE tt WHERE tt.EventID = e.EventID) as TotalTickets,
          (SELECT SUM(tt.Sold) FROM TICKETTYPE tt WHERE tt.EventID = e.EventID) as SoldTickets
        FROM EVENT e
        LEFT JOIN ORGANIZER o ON e.OrganizerID = o.OrganizerID
        WHERE e.EventID = @eventId
      `);
        return result.recordset[0];
    }

    // 17. Lấy loại vé cho sự kiện
    static async getEventTicketTypes(eventId) {
        const pool = getSQLPool();
        const result = await pool.request()
            .input('eventId', sql.Int, eventId)
            .query(`
        SELECT 
          TicketTypeID,
          TicketName,
          Price,
          Quantity,
          Sold,
          (Quantity - Sold) as Available,
          Description
        FROM TICKETTYPE
        WHERE EventID = @eventId
        ORDER BY Price ASC
      `);
        return result.recordset;
    }

    // Health check
    static async healthCheck() {
        try {
            const pool = getSQLPool();
            const result = await pool.request().query('SELECT @@VERSION as version, DB_NAME() as dbname');
            return {
                status: 'connected',
                database: result.recordset[0].dbname,
                version: result.recordset[0].version.substring(0, 50),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
}

module.exports = { SQLServices };