export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt?: string;
}

export interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkPermission: (requiredRole?: 'user' | 'admin') => boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    message?: string;
    token?: string;
}