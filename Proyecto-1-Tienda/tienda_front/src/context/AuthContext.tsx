import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    cedula: string;
    phone: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    cedula: string;
    phone: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const initAuth = async () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
            // Verificar si el token es válido
            const userData = await authAPI.verifyToken(storedToken);
            setUser(userData);
            setToken(storedToken);
            } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('token');
            setToken(null);
            }
        }
        setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
        setIsLoading(true);
        const response = await authAPI.login(email, password);
        
        if (response.success && response.token && response.user) {
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('token', response.token);
            return true;
        }
        return false;
        } catch (error) {
        console.error('Login error:', error);
        return false;
        } finally {
        setIsLoading(false);
        }
    };

    const register = async (userData: RegisterData): Promise<boolean> => {
        try {
        setIsLoading(true);
        const response = await authAPI.register(userData);
        
        if (response.success && response.token && response.user) {
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('token', response.token);
            return true;
        }
        return false;
        } catch (error) {
        console.error('Registration error:', error);
        return false;
        } finally {
        setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
};