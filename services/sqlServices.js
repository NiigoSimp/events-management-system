const { getSQLPool, sql } = require('../config/sqlServer');

class SQLServices {
    // EVENT METHODS
    static async createEvent(eventData) {
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

    static async getUpcomingEvents() {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .query(`
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

    static async getEventDetails(eventId) {
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

    static async getEventTicketTypes(eventId) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('EventID', sql.Int, eventId)
                .query(`
                    SELECT 
                        *,
                        (Quantity - Sold) as AvailableTickets
                    FROM TICKETTYPE 
                    WHERE EventID = @EventID
                    ORDER BY Price ASC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getEventTicketTypes:', error);
            throw error;
        }
    }

    static async getTicketsByEvent(eventId) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('EventID', sql.Int, eventId)
                .query(`
                    SELECT 
                        t.TicketID,
                        t.TicketCode,
                        t.IsCheckedIn,
                        t.CheckInAt,
                        tt.TicketName,
                        tt.Price,
                        c.FullName as CustomerName,
                        c.Email as CustomerEmail,
                        r.RegistrationDate
                    FROM TICKET t
                    JOIN TICKETTYPE tt ON t.TicketTypeID = tt.TicketTypeID
                    JOIN REGISTRATION r ON t.RegistrationID = r.RegistrationID
                    JOIN CUSTOMER c ON r.CustomerID = c.CustomerID
                    WHERE tt.EventID = @EventID
                    ORDER BY r.RegistrationDate DESC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getTicketsByEvent:', error);
            throw error;
        }
    }

    static async getEventRevenue(eventId) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('EventID', sql.Int, eventId)
                .query(`
                    SELECT 
                        SUM(r.TotalAmount) as TotalRevenue,
                        COUNT(r.RegistrationID) as TotalRegistrations,
                        SUM(r.Quantity) as TotalTicketsSold
                    FROM REGISTRATION r
                    JOIN TICKETTYPE tt ON r.TicketTypeID = tt.TicketTypeID
                    WHERE tt.EventID = @EventID AND r.PaymentStatus = 'Completed'
                `);

            return result.recordset[0] || { TotalRevenue: 0, TotalRegistrations: 0, TotalTicketsSold: 0 };
        } catch (error) {
            console.error('Error in getEventRevenue:', error);
            throw error;
        }
    }

    static async updateEvent(eventId, updateData) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('EventID', sql.Int, eventId)
                .input('EventName', sql.NVarChar, updateData.EventName)
                .input('Location', sql.NVarChar, updateData.Location)
                .input('StartDate', sql.DateTime, updateData.StartDate)
                .input('EndDate', sql.DateTime, updateData.EndDate)
                .input('Description', sql.NVarChar, updateData.Description)
                .input('Category', sql.NVarChar, updateData.Category)
                .input('Status', sql.NVarChar, updateData.Status)
                .query(`
                    UPDATE EVENT 
                    SET EventName = @EventName, 
                        Location = @Location, 
                        StartDate = @StartDate,
                        EndDate = @EndDate,
                        Description = @Description, 
                        Category = @Category,
                        Status = @Status
                    WHERE EventID = @EventID
                `);

            return result;
        } catch (error) {
            console.error('Error in updateEvent:', error);
            throw error;
        }
    }

    // TICKET TYPE METHODS
    static async createTicketType(ticketData) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('EventID', sql.Int, ticketData.EventID)
                .input('TicketName', sql.NVarChar, ticketData.TicketName)
                .input('Price', sql.Decimal(10,2), ticketData.Price)
                .input('Quantity', sql.Int, ticketData.Quantity)
                .input('Description', sql.NVarChar, ticketData.Description)
                .query(`
                    INSERT INTO TICKETTYPE (EventID, TicketName, Price, Quantity, Description)
                    OUTPUT INSERTED.*
                    VALUES (@EventID, @TicketName, @Price, @Quantity, @Description)
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Error in createTicketType:', error);
            throw error;
        }
    }

    // STATISTICS METHODS
    static async getEventsCountByStatus() {
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
            console.error('Error in getEventsCountByStatus:', error);
            throw error;
        }
    }

    static async getTopEvents(limit = 10) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('Limit', sql.Int, limit)
                .query(`
                    SELECT TOP (@Limit)
                        e.EventID,
                        e.EventName,
                        e.StartDate,
                        e.Location,
                        COUNT(r.RegistrationID) as RegistrationCount,
                        SUM(r.Quantity) as TicketsSold,
                        SUM(r.TotalAmount) as Revenue
                    FROM EVENT e
                    LEFT JOIN REGISTRATION r ON e.EventID = r.EventID AND r.PaymentStatus = 'Completed'
                    GROUP BY e.EventID, e.EventName, e.StartDate, e.Location
                    ORDER BY Revenue DESC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getTopEvents:', error);
            throw error;
        }
    }

    static async getEventCategories() {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .query(`
                    SELECT Category, COUNT(*) as EventCount
                    FROM EVENT
                    GROUP BY Category
                    ORDER BY EventCount DESC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getEventCategories:', error);
            throw error;
        }
    }

    // REGISTRATION METHODS
    static async getPendingRegistrationsAfter24h() {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .query(`
                    SELECT 
                        r.RegistrationID,
                        c.FullName,
                        c.Email,
                        e.EventName,
                        r.RegistrationDate,
                        r.TotalAmount,
                        r.PaymentStatus
                    FROM REGISTRATION r
                    JOIN CUSTOMER c ON r.CustomerID = c.CustomerID
                    JOIN EVENT e ON r.EventID = e.EventID
                    WHERE r.PaymentStatus = 'Pending'
                    AND r.RegistrationDate < DATEADD(hour, -24, GETDATE())
                    ORDER BY r.RegistrationDate DESC
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getPendingRegistrationsAfter24h:', error);
            throw error;
        }
    }

    static async getPaymentStatusByEvent() {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .query(`
                    SELECT 
                        e.EventID,
                        e.EventName,
                        r.PaymentStatus,
                        COUNT(r.RegistrationID) as RegistrationCount,
                        SUM(r.Quantity) as TicketCount,
                        SUM(r.TotalAmount) as TotalAmount
                    FROM EVENT e
                    JOIN REGISTRATION r ON e.EventID = r.EventID
                    GROUP BY e.EventID, e.EventName, r.PaymentStatus
                    ORDER BY e.EventID, r.PaymentStatus
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in getPaymentStatusByEvent:', error);
            throw error;
        }
    }

    // TICKET REGISTRATION
    static async registerTickets(customerId, eventId, ticketTypeId, quantity) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('CustomerID', sql.Int, customerId)
                .input('EventID', sql.Int, eventId)
                .input('TicketTypeID', sql.Int, ticketTypeId)
                .input('Quantity', sql.Int, quantity)
                .execute('sp_RegisterTickets');

            return result.recordset[0] || { Success: 0, Message: 'Registration failed' };
        } catch (error) {
            console.error('Error in registerTickets:', error);
            return { Success: 0, Message: error.message };
        }
    }

    static async createRegistration(registrationData) {
        try {
            const pool = await getSQLPool();
            const { CustomerID, EventID, TicketTypeID, Quantity, TotalAmount } = registrationData;

            const result = await pool.request()
                .input('CustomerID', sql.Int, CustomerID)
                .input('EventID', sql.Int, EventID)
                .input('TicketTypeID', sql.Int, TicketTypeID)
                .input('Quantity', sql.Int, Quantity)
                .input('TotalAmount', sql.Decimal(10,2), TotalAmount)
                .query(`
                    INSERT INTO REGISTRATION (CustomerID, EventID, TicketTypeID, Quantity, TotalAmount)
                    OUTPUT INSERTED.*
                    VALUES (@CustomerID, @EventID, @TicketTypeID, @Quantity, @TotalAmount)
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Error in createRegistration:', error);
            throw error;
        }
    }

    static async generateTickets(registrationId, ticketTypeId, quantity) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('RegistrationID', sql.Int, registrationId)
                .input('TicketTypeID', sql.Int, ticketTypeId)
                .input('Quantity', sql.Int, quantity)
                .query(`
                    INSERT INTO TICKET (RegistrationID, TicketTypeID, TicketCode)
                    OUTPUT INSERTED.*
                    SELECT @RegistrationID, @TicketTypeID, 
                           'TICKET-' + CAST(@RegistrationID AS NVARCHAR) + '-' + 
                           CAST(@TicketTypeID AS NVARCHAR) + '-' + 
                           CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS NVARCHAR) + '-' +
                           CAST(ABS(CHECKSUM(NEWID())) AS NVARCHAR(10))
                    FROM (SELECT TOP (@Quantity) 1 as n FROM sys.objects) numbers
                `);

            return result.recordset;
        } catch (error) {
            console.error('Error in generateTickets:', error);
            throw error;
        }
    }

    // PAYMENT METHODS
    static async createPayment(paymentData) {
        try {
            const pool = await getSQLPool();
            const { RegistrationID, PaymentMethod, Amount, Status, GatewayRef } = paymentData;

            const result = await pool.request()
                .input('RegistrationID', sql.Int, RegistrationID)
                .input('PaymentMethod', sql.NVarChar, PaymentMethod)
                .input('Amount', sql.Decimal(10,2), Amount)
                .input('Status', sql.NVarChar, Status)
                .input('GatewayRef', sql.NVarChar, GatewayRef)
                .query(`
                    INSERT INTO PAYMENT (RegistrationID, PaymentMethod, Amount, Status, GatewayRef)
                    OUTPUT INSERTED.*
                    VALUES (@RegistrationID, @PaymentMethod, @Amount, @Status, @GatewayRef)
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Error in createPayment:', error);
            throw error;
        }
    }

    static async updateRegistrationPaymentStatus(registrationId, status) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('RegistrationID', sql.Int, registrationId)
                .input('PaymentStatus', sql.NVarChar, status)
                .query(`
                    UPDATE REGISTRATION 
                    SET PaymentStatus = @PaymentStatus 
                    WHERE RegistrationID = @RegistrationID
                `);

            return result;
        } catch (error) {
            console.error('Error in updateRegistrationPaymentStatus:', error);
            throw error;
        }
    }

    // CUSTOMER METHODS
    static async getCustomerByEmail(email) {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .input('Email', sql.NVarChar, email)
                .query('SELECT * FROM CUSTOMER WHERE Email = @Email');

            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error in getCustomerByEmail:', error);
            throw error;
        }
    }

    static async createCustomer(customerData) {
        try {
            const pool = await getSQLPool();
            const { FullName, Email, Phone, PasswordHash } = customerData;

            const result = await pool.request()
                .input('FullName', sql.NVarChar, FullName)
                .input('Email', sql.NVarChar, Email)
                .input('Phone', sql.NVarChar, Phone)
                .input('PasswordHash', sql.NVarChar, PasswordHash)
                .query(`
                    INSERT INTO CUSTOMER (FullName, Email, Phone, PasswordHash)
                    OUTPUT INSERTED.*
                    VALUES (@FullName, @Email, @Phone, @PasswordHash)
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Error in createCustomer:', error);
            throw error;
        }
    }

    // SEARCH METHODS
    static async searchEvents(category = null, location = null) {
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
                    o.OrganizerName
                FROM EVENT e
                JOIN ORGANIZER o ON e.OrganizerID = o.OrganizerID
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

            query += ' ORDER BY e.StartDate ASC';

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error in searchEvents:', error);
            throw error;
        }
    }

    // HEALTH CHECK
    static async healthCheck() {
        try {
            const pool = await getSQLPool();
            const result = await pool.request()
                .query('SELECT @@VERSION as version, GETDATE() as currentTime');

            return {
                status: 'healthy',
                database: 'SQL Server',
                version: result.recordset[0]?.version,
                timestamp: result.recordset[0]?.currentTime
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                database: 'SQL Server',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = { SQLServices };