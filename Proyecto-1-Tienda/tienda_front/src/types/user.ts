export interface User {
    id: number;
    name: string;
    email: string;
    cedula: string;
    phone: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
    error: string | null; 
    clearError: () => void; 
}

export interface RegisterData {
    name: string;
    email: string;
    cedula: string;
    phone: string;
    password: string;
}