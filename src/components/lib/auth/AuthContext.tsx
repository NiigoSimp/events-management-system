'use client';
import { createContext } from 'react';
import { UserRole } from './constants';

// User interface với type chính xác
export interface User {
    // Basic info
    id: string;
    email: string;
    name: string;
    role: UserRole;

    // Profile info
    avatar?: string;
    phone?: string;
    department?: string;

    // Permissions
    permissions: string[];

    // Timestamps
    lastLogin?: string | null;
    createdAt: string;

    // Status
    isActive: boolean;
    isVerified: boolean;
}

// Auth context
export interface AuthContextType {
    // User data
    user: User | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    loading: boolean;

    // Auth methods
    login: (userData: User) => void;
    loginWithCredentials: (email: string, password: string) => boolean;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => void;

    // Permission methods
    hasPermission: (permission: string) => boolean;
    canAccessRoute: (route: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);