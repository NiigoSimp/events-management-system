'use client';
import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { User, AuthContextType } from './AuthContext';
import { ADMIN_ACCOUNT, DEMO_USERS, AUTH_CONFIG, USER_ROLES, PERMISSIONS, ROUTES, UserRole } from './constants';

interface AuthProviderProps {
    children: React.ReactNode;
}

interface StoredUserData {
    user: User;
    timestamp: number;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if session is valid
    const isSessionValid = useCallback((timestamp: number): boolean => {
        return Date.now() - timestamp < AUTH_CONFIG.SESSION_DURATION;
    }, []);

    // Find user by email and password
    const findUserByCredentials = useCallback((email: string, password: string): User | null => {
        const normalizedEmail = email.toLowerCase().trim();

        console.log('Checking credentials:', { email: normalizedEmail, password });

        // Check admin account
        if (normalizedEmail === ADMIN_ACCOUNT.email.toLowerCase() && password === ADMIN_ACCOUNT.password) {
            console.log('Admin login successful');
            return {
                id: ADMIN_ACCOUNT.id,
                email: ADMIN_ACCOUNT.email,
                name: ADMIN_ACCOUNT.name,
                role: USER_ROLES.ADMIN as UserRole,
                permissions: ADMIN_ACCOUNT.permissions,
                department: ADMIN_ACCOUNT.department,
                phone: ADMIN_ACCOUNT.phone,
                avatar: ADMIN_ACCOUNT.avatar,
                lastLogin: new Date().toISOString(),
                createdAt: ADMIN_ACCOUNT.createdAt,
                isActive: ADMIN_ACCOUNT.isActive,
                isVerified: ADMIN_ACCOUNT.isVerified
            };
        }

        // Check demo users
        const demoUser = DEMO_USERS.find(
            user => user.email.toLowerCase() === normalizedEmail && user.password === password
        );

        if (demoUser) {
            console.log('Demo user login successful:', demoUser.email);
            return {
                id: demoUser.id,
                email: demoUser.email,
                name: demoUser.name,
                role: USER_ROLES.USER as UserRole,
                permissions: demoUser.permissions,
                lastLogin: new Date().toISOString(),
                createdAt: demoUser.createdAt,
                isActive: demoUser.isActive,
                isVerified: demoUser.isVerified
            };
        }

        console.log('Login failed: Invalid credentials');
        return null;
    }, []);

    // Check if user has specific permission
    const hasPermission = useCallback((permission: string): boolean => {
        if (!user) return false;

        if (user.permissions.includes(PERMISSIONS.ALL)) {
            return true;
        }

        return user.permissions.includes(permission);
    }, [user]);

    // Check if user can access specific route
    const canAccessRoute = useCallback((route: string): boolean => {
        if (!user) return false;

        // Public routes are accessible to everyone
        if (ROUTES.PUBLIC.includes(route as any)) return true;

        // Check protected routes
        if (ROUTES.PROTECTED.includes(route as any)) {
            return user.role === USER_ROLES.USER || user.role === USER_ROLES.ADMIN;
        }

        // Check admin routes
        if (ROUTES.ADMIN.some((r: string) => route.startsWith(r))) {
            return user.role === USER_ROLES.ADMIN;
        }

        return false;
    }, [user]);

    // Initialize auth from storage
    const initializeAuth = useCallback(() => {
        try {
            const storedData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);

            if (!storedData) {
                setLoading(false);
                return;
            }

            const parsedData: StoredUserData = JSON.parse(storedData);

            if (!isSessionValid(parsedData.timestamp)) {
                localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
                setLoading(false);
                return;
            }

            setUser(parsedData.user);
        } catch (error) {
            console.error('Auth initialization error:', error);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
        } finally {
            setLoading(false);
        }
    }, [isSessionValid]);

    // Login function với password check
    const loginWithCredentials = useCallback((email: string, password: string): boolean => {
        const userData = findUserByCredentials(email, password);

        if (!userData) {
            return false; // Login failed
        }

        const storedData: StoredUserData = {
            user: userData,
            timestamp: Date.now()
        };

        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(storedData));
        setUser(userData);
        return true; // Login success
    }, [findUserByCredentials]);

    // Simple login function for components
    const login = useCallback((userData: User) => {
        const storedData: StoredUserData = {
            user: userData,
            timestamp: Date.now()
        };
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(storedData));
        setUser(userData);
    }, []);

    // Update profile function
    const updateProfile = useCallback((userData: Partial<User>) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            ...userData
        };

        const storedData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
        if (storedData) {
            const parsedData: StoredUserData = JSON.parse(storedData);
            const updatedStoredData: StoredUserData = {
                ...parsedData,
                user: updatedUser
            };
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(updatedStoredData));
        }

        setUser(updatedUser);
    }, [user]);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
        setUser(null);
    }, []);

    // Initialize auth on mount
    useEffect(() => {
        initializeAuth();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === AUTH_CONFIG.STORAGE_KEY) {
                initializeAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [initializeAuth]);

    // Auto-logout when session expires
    useEffect(() => {
        if (!user) return;

        const checkSession = setInterval(() => {
            const storedData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
            if (storedData) {
                const parsedData: StoredUserData = JSON.parse(storedData);
                if (!isSessionValid(parsedData.timestamp)) {
                    logout();
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkSession);
    }, [user, isSessionValid, logout]);

    const contextValue: AuthContextType & { loginWithCredentials: (email: string, password: string) => boolean } = {
        // User data
        user,
        isAdmin: user?.role === USER_ROLES.ADMIN,
        isAuthenticated: !!user,
        loading,

        // Auth methods
        login,
        logout,
        updateProfile,

        // Permission methods
        hasPermission,
        canAccessRoute,

        // New method for credential login
        loginWithCredentials
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}