export const AUTH_CONFIG = {
    STORAGE_KEY: 'event_management_user',
    TOKEN_KEY: 'event_management_token',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
};

export const ADMIN_ACCOUNT = {
    id: '1002270130042708',
    email: 'thehollow2008@gmail.com',
    password: 'NiigoPeakS1tg',
    name: 'System Administrator',
    role: 'admin' as const,
    permissions: ['all'],
    department: 'System Administration',
    phone: '+84 123 456 789',
    avatar: '/avatars/admin-001.jpg',
    lastLogin: null as string | null,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
    isVerified: true
};

export const DEMO_USERS = [
    {
        id: 'user-001',
        email: 'user@example.com',
        password: 'User@123456',
        name: 'Demo User',
        role: 'user' as const,
        permissions: ['events', 'tickets'],
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 'user-002',
        email: 'test@example.com',
        password: 'Test@123456',
        name: 'Test User',
        role: 'user' as const,
        permissions: ['events', 'tickets'],
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z'
    }
];


// Role definitions - Sử dụng string literal types
export type UserRole = 'admin' | 'user';

export const USER_ROLES: Record<string, UserRole> = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

// Permission levels
export const PERMISSIONS = {
    ALL: 'all',
    EVENTS: 'events',
    USERS: 'users',
    ANALYTICS: 'analytics',
    CONTENT: 'content',
    MEDIA: 'media',
    TICKETS: 'tickets',
    SETTINGS: 'settings'
} as const;

// Route access configuration - Sử dụng readonly arrays
export const ROUTES = {
    PUBLIC: ['/', '/login', '/register', '/about', '/contact', '/events'] as const,
    PROTECTED: ['/dashboard', '/profile', '/my-events', '/my-tickets'] as const,
    ADMIN: ['/admin', '/admin/users', '/admin/events', '/admin/analytics', '/admin/settings'] as const
} as const;

// Auth messages
export const AUTH_MESSAGES = {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    UNAUTHORIZED: 'Bạn không có quyền truy cập trang này.',
    FORBIDDEN: 'Truy cập bị từ chối.',
    SESSION_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.',
    EMAIL_NOT_VERIFIED: 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư.',
    PASSWORD_RESET_SENT: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.'
} as const;