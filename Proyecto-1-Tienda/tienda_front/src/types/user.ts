

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
export interface User {
  id: number;
  name: string;
  email: string;
  cedula: string;
  phone: string;
  password: string;
  // Nuevos campos para sellers
  avatar_url?: string;
  bio?: string;
  rating: number;
  total_sales: number;
  is_verified: boolean;
  address?: Address;
  social_links?: SocialLinks;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    cedula: string;
    phone: string;
    password: string;
}