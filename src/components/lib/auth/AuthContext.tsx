'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean; // Add this line
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate derived states
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin'; // Add this calculation

    // Mock authentication for development
    const mockUsers: User[] = [
        { id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'admin' },
        { id: '2', name: 'Regular User', email: 'user@demo.com', role: 'user' }
    ];

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const foundUser = mockUsers.find(u => u.email === credentials.email);

            if (foundUser && credentials.password === 'password') {
                setUser(foundUser);
                localStorage.setItem('authToken', 'mock-token');
                localStorage.setItem('user', JSON.stringify(foundUser));
            } else {
                throw new Error('Invalid email or password');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            if (credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            const newUser: User = {
                id: Date.now().toString(),
                name: credentials.name,
                email: credentials.email,
                role: 'user'
            };

            setUser(newUser);
            localStorage.setItem('authToken', 'mock-token');
            localStorage.setItem('user', JSON.stringify(newUser));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };

    // Check for existing auth on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                if (typeof window === 'undefined') {
                    setIsLoading(false);
                    return;
                }

                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('user');

                if (token && userData) {
                    const user = JSON.parse(userData);
                    setUser(user);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isLoading,
        error,
        isAuthenticated,
        isAdmin, // Add this to the context value
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;