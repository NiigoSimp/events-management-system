const { SQLServices } = require('../services/SQLServices');

async function seedSQLData() {
    try {
        console.log('Starting SQL Server data seeding...');

        // Test connection first
        const health = await SQLServices.healthCheck();
        console.log('SQL Server Connection:', health.status);

        // Clear existing data (optional - comment out if you want to keep existing data)
        await clearExistingData();

        // Seed Organizers
        const organizers = await seedOrganizers();
        console.log(`Created ${organizers.length} organizers`);

        // Seed Customers
        const customers = await seedCustomers();
        console.log(`Created ${customers.length} customers`);

        // Seed Events
        const events = await seedEvents(organizers);
        console.log(`Created ${events.length} events`);

        // Seed Ticket Types
        const ticketTypes = await seedTicketTypes(events);
        console.log(`Created ${ticketTypes.length} ticket types`);

        // Seed Registrations & Tickets
        const registrations = await seedRegistrations(customers, events, ticketTypes);
        console.log(`Created ${registrations.length} registrations`);

        // Seed Payments
        const payments = await seedPayments(registrations);
        console.log(`Created ${payments.length} payments`);

        // Seed Feedback
        const feedback = await seedFeedback(customers, events);
        console.log(`Created ${feedback.length} feedback entries`);

        console.log(' SQL Server data seeding completed successfully!');
        await generateSummary();

    } catch (error) {
        console.error('Failed to seed SQL data:', error);
    }
}

async function clearExistingData() {
    try {
        console.log('Clearing existing data...');

        // Note: Be careful with deletion order due to foreign key constraints
        const queries = [
            'DELETE FROM FEEDBACK',
            'DELETE FROM TICKET',
            'DELETE FROM PAYMENT',
            'DELETE FROM REGISTRATION',
            'DELETE FROM TICKETTYPE',
            'DELETE FROM EVENT',
            'DELETE FROM CUSTOMER',
            'DELETE FROM ORGANIZER'
        ];

        for (const query of queries) {
            try {
                await SQLServices.executeQuery(query);
            } catch (error) {
                console.log(`Could not execute: ${query}`, error.message);
            }
        }

        console.log('✅ Existing data cleared');
    } catch (error) {
        console.log(' Clear data warning:', error.message);
    }
}

async function seedOrganizers() {
    const organizers = [
        {
            OrganizerName: "Tech Conference Vietnam",
            Email: "info@techconf.vn",
            Phone: "+84-91-234-5678",
            Address: "HCMC, Vietnam",
            Description: "Leading technology conference organizer in Vietnam"
        },
        {
            OrganizerName: "Music Festival Network",
            Email: "contact@musicfest.net",
            Phone: "+84-98-765-4321",
            Address: "Hanoi, Vietnam",
            Description: "Premier music festival and concert organizer"
        },
        {
            OrganizerName: "Art & Culture Group",
            Email: "hello@artculture.com",
            Phone: "+84-90-112-2334",
            Address: "Da Nang, Vietnam",
            Description: "Cultural events and art exhibition organizer"
        },
        {
            OrganizerName: "Business Summit Asia",
            Email: "events@businessasia.com",
            Phone: "+84-93-445-5667",
            Address: "Hanoi, Vietnam",
            Description: "Business conferences and corporate events"
        }
    ];

    const createdOrganizers = [];
    for (const org of organizers) {
        try {
            const result = await SQLServices.createOrganizer(org);
            createdOrganizers.push(result);
        } catch (error) {
            console.log(`️ Could not create organizer: ${org.OrganizerName}`, error.message);
        }
    }

    return createdOrganizers;
}

async function seedCustomers() {
    const customers = [
        {
            FullName: "Nguyen Van An",
            Email: "an.nguyen@email.com",
            Phone: "090-111-1111",
            PasswordHash: "hashed_password_123"
        },
        {
            FullName: "Tran Thi Binh",
            Email: "binh.tran@email.com",
            Phone: "090-222-2222",
            PasswordHash: "hashed_password_456"
        },
        {
            FullName: "Le Van Cuong",
            Email: "cuong.le@email.com",
            Phone: "090-333-3333",
            PasswordHash: "hashed_password_789"
        },
        {
            FullName: "Pham Thi Dung",
            Email: "dung.pham@email.com",
            Phone: "090-444-4444",
            PasswordHash: "hashed_password_012"
        },
        {
            FullName: "Hoang Minh Duc",
            Email: "duc.hoang@email.com",
            Phone: "090-555-5555",
            PasswordHash: "hashed_password_345"
        }
    ];

    const createdCustomers = [];
    for (const cust of customers) {
        try {
            const result = await SQLServices.createCustomer(cust);
            createdCustomers.push(result);
        } catch (error) {
            console.log(` Could not create customer: ${cust.FullName}`, error.message);
        }
    }

    return createdCustomers;
}

async function seedEvents(organizers) {
    const events = [
        {
            OrganizerID: organizers[0].OrganizerID,
            EventName: "Tech Conference 2024",
            Location: "HCMC Convention Center",
            StartDate: new Date("2024-03-15T09:00:00Z"),
            EndDate: new Date("2024-03-16T17:00:00Z"),
            Description: "Annual technology conference featuring latest innovations in AI, Blockchain, and Cloud Computing",
            Category: "Technology",
            Status: "Active"
        },
        {
            OrganizerID: organizers[1].OrganizerID,
            EventName: "Vietnam Music Festival 2024",
            Location: "Hanoi Opera House",
            StartDate: new Date("2024-04-20T18:00:00Z"),
            EndDate: new Date("2024-04-21T23:00:00Z"),
            Description: "Spring music festival with popular artists and bands from across Vietnam",
            Category: "Music",
            Status: "Active"
        },
        {
            OrganizerID: organizers[2].OrganizerID,
            EventName: "Modern Art Exhibition",
            Location: "Da Nang Museum of Fine Arts",
            StartDate: new Date("2024-05-10T10:00:00Z"),
            EndDate: new Date("2024-05-30T18:00:00Z"),
            Description: "Contemporary art exhibition featuring works from emerging Vietnamese artists",
            Category: "Art",
            Status: "Active"
        },
        {
            OrganizerID: organizers[3].OrganizerID,
            EventName: "Asia Business Summit 2024",
            Location: "Hanoi National Convention Center",
            StartDate: new Date("2024-06-05T08:00:00Z"),
            EndDate: new Date("2024-06-07T17:00:00Z"),
            Description: "International business conference focusing on Asian market trends and opportunities",
            Category: "Business",
            Status: "Active"
        },
        {
            OrganizerID: organizers[0].OrganizerID,
            EventName: "AI & Machine Learning Workshop",
            Location: "HCMC University of Technology",
            StartDate: new Date("2024-02-20T13:00:00Z"),
            EndDate: new Date("2024-02-20T17:00:00Z"),
            Description: "Hands-on workshop on artificial intelligence and machine learning applications",
            Category: "Technology",
            Status: "Completed"
        }
    ];

    const createdEvents = [];
    for (const event of events) {
        try {
            const result = await SQLServices.createEvent(event);
            createdEvents.push(result);
        } catch (error) {
            console.log(` Could not create event: ${event.EventName}`, error.message);
        }
    }

    return createdEvents;
}

async function seedTicketTypes(events) {
    const ticketTypes = [
        // Tech Conference 2024
        {
            EventID: events[0].EventID,
            TicketName: "Early Bird",
            Price: 500000,
            Quantity: 200,
            Description: "Early bird discount ticket"
        },
        {
            EventID: events[0].EventID,
            TicketName: "Regular",
            Price: 700000,
            Quantity: 300,
            Description: "Standard admission ticket"
        },
        {
            EventID: events[0].EventID,
            TicketName: "VIP",
            Price: 1200000,
            Quantity: 50,
            Description: "VIP access with premium benefits"
        },

        // Music Festival 2024
        {
            EventID: events[1].EventID,
            TicketName: "General Admission",
            Price: 200000,
            Quantity: 1000,
            Description: "General admission standing ticket"
        },
        {
            EventID: events[1].EventID,
            TicketName: "VIP Experience",
            Price: 500000,
            Quantity: 100,
            Description: "VIP seating and backstage access"
        },

        // Art Exhibition
        {
            EventID: events[2].EventID,
            TicketName: "Adult",
            Price: 100000,
            Quantity: 500,
            Description: "Adult admission ticket"
        },
        {
            EventID: events[2].EventID,
            TicketName: "Student",
            Price: 50000,
            Quantity: 200,
            Description: "Student discount ticket"
        },

        // Business Summit
        {
            EventID: events[3].EventID,
            TicketName: "Standard Pass",
            Price: 1500000,
            Quantity: 150,
            Description: "Standard conference pass"
        },
        {
            EventID: events[3].EventID,
            TicketName: "Executive Pass",
            Price: 2500000,
            Quantity: 50,
            Description: "Executive pass with networking events"
        }
    ];

    const createdTicketTypes = [];
    for (const ticketType of ticketTypes) {
        try {
            const result = await SQLServices.createTicketType(ticketType);
            createdTicketTypes.push(result);
        } catch (error) {
            console.log(`⚠️ Could not create ticket type: ${ticketType.TicketName}`, error.message);
        }
    }

    return createdTicketTypes;
}

async function seedRegistrations(customers, events, ticketTypes) {
    const registrations = [
        {
            CustomerID: customers[0].CustomerID,
            EventID: events[0].EventID,
            TicketTypeID: ticketTypes[0].TicketTypeID, // Early Bird Tech
            Quantity: 2,
            TotalAmount: 1000000,
            PaymentStatus: "Completed"
        },
        {
            CustomerID: customers[1].CustomerID,
            EventID: events[1].EventID,
            TicketTypeID: ticketTypes[3].TicketTypeID, // General Admission Music
            Quantity: 4,
            TotalAmount: 800000,
            PaymentStatus: "Completed"
        },
        {
            CustomerID: customers[2].CustomerID,
            EventID: events[0].EventID,
            TicketTypeID: ticketTypes[1].TicketTypeID, // Regular Tech
            Quantity: 1,
            TotalAmount: 700000,
            PaymentStatus: "Completed"
        },
        {
            CustomerID: customers[3].CustomerID,
            EventID: events[2].EventID,
            TicketTypeID: ticketTypes[5].TicketTypeID, // Student Art
            Quantity: 2,
            TotalAmount: 100000,
            PaymentStatus: "Pending"
        },
        {
            CustomerID: customers[4].CustomerID,
            EventID: events[3].EventID,
            TicketTypeID: ticketTypes[7].TicketTypeID, // Standard Business
            Quantity: 1,
            TotalAmount: 1500000,
            PaymentStatus: "Completed"
        }
    ];

    const createdRegistrations = [];
    for (const reg of registrations) {
        try {
            const result = await SQLServices.createRegistration(reg);

            // Generate tickets for completed payments
            if (reg.PaymentStatus === "Completed") {
                const tickets = await SQLServices.generateTickets(
                    result.RegistrationID,
                    reg.TicketTypeID,
                    reg.Quantity
                );
                console.log(`   🎫 Generated ${tickets.length} tickets for registration ${result.RegistrationID}`);
            }

            createdRegistrations.push(result);
        } catch (error) {
            console.log(`⚠️ Could not create registration for customer ${reg.CustomerID}`, error.message);
        }
    }

    return createdRegistrations;
}

async function seedPayments(registrations) {
    const payments = [
        {
            RegistrationID: registrations[0].RegistrationID,
            PaymentMethod: "Credit Card",
            Amount: 1000000,
            Status: "Success",
            GatewayRef: "PAY-001-2024"
        },
        {
            RegistrationID: registrations[1].RegistrationID,
            PaymentMethod: "Bank Transfer",
            Amount: 800000,
            Status: "Success",
            GatewayRef: "PAY-002-2024"
        },
        {
            RegistrationID: registrations[2].RegistrationID,
            PaymentMethod: "E-Wallet",
            Amount: 700000,
            Status: "Success",
            GatewayRef: "PAY-003-2024"
        },
        {
            RegistrationID: registrations[4].RegistrationID,
            PaymentMethod: "Credit Card",
            Amount: 1500000,
            Status: "Success",
            GatewayRef: "PAY-004-2024"
        }
    ];

    const createdPayments = [];
    for (const payment of payments) {
        try {
            const result = await SQLServices.createPayment(payment);
            createdPayments.push(result);
        } catch (error) {
            console.log(`⚠️ Could not create payment for registration ${payment.RegistrationID}`, error.message);
        }
    }

    return createdPayments;
}

async function seedFeedback(customers, events) {
    const feedback = [
        {
            EventID: events[0].EventID,
            CustomerID: customers[0].CustomerID,
            Rating: 5,
            Comment: "Excellent conference! Great speakers and networking opportunities."
        },
        {
            EventID: events[1].EventID,
            CustomerID: customers[1].CustomerID,
            Rating: 4,
            Comment: "Amazing performances, but food options could be better."
        },
        {
            EventID: events[0].EventID,
            CustomerID: customers[2].CustomerID,
            Rating: 5,
            Comment: "Very informative sessions about AI and machine learning."
        },
        {
            EventID: events[2].EventID,
            CustomerID: customers[3].CustomerID,
            Rating: 4,
            Comment: "Beautiful artwork, would love to see more interactive exhibits."
        }
    ];

    const createdFeedback = [];
    for (const fb of feedback) {
        try {
            const result = await SQLServices.createFeedback(fb);
            createdFeedback.push(result);
        } catch (error) {
            console.log(`⚠️ Could not create feedback for event ${fb.EventID}`, error.message);
        }
    }

    return createdFeedback;
}

async function generateSummary() {
    try {
        console.log('\n📊 SEEDING SUMMARY:');

        const [events, customers, organizers, ticketTypes, registrations] = await Promise.all([
            SQLServices.executeQuery('SELECT COUNT(*) as count FROM EVENT'),
            SQLServices.executeQuery('SELECT COUNT(*) as count FROM CUSTOMER'),
            SQLServices.executeQuery('SELECT COUNT(*) as count FROM ORGANIZER'),
            SQLServices.executeQuery('SELECT COUNT(*) as count FROM TICKETTYPE'),
            SQLServices.executeQuery('SELECT COUNT(*) as count FROM REGISTRATION')
        ]);

        console.log(`   • Events: ${events[0].count}`);
        console.log(`   • Customers: ${customers[0].count}`);
        console.log(`   • Organizers: ${organizers[0].count}`);
        console.log(`   • Ticket Types: ${ticketTypes[0].count}`);
        console.log(`   • Registrations: ${registrations[0].count}`);

        // Test data retrieval
        const upcomingEvents = await SQLServices.getUpcomingEvents();
        console.log(`\n🎯 Upcoming Events: ${upcomingEvents.length}`);

        upcomingEvents.forEach(event => {
            console.log(`   - ${event.EventName} (${event.StartDate})`);
        });

    } catch (error) {
        console.log('⚠️ Could not generate summary:', error.message);
    }
}

// Run if this script is executed directly
if (require.main === module) {
    seedSQLData().then(() => {
        console.log('\n✨ SQL Server seeding process completed!');
        process.exit(0);
    }).catch(error => {
        console.error('\n💥 SQL Server seeding failed:', error);
        process.exit(1);
    });
}

module.exports = { seedSQLData };