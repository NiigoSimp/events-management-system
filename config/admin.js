const adminConfig = {
    roles: {
        admin: 'admin',
        organizer: 'organizer',
        user: 'user'
    },
    permissions: {
        admin: ['read', 'write', 'delete', 'manage_users'],
        organizer: ['read', 'write', 'manage_events'],
        user: ['read', 'purchase_tickets']
    }
};

module.exports = adminConfig;