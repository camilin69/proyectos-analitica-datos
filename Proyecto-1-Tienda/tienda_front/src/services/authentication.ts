// services/authentication.ts (actualizado)
import { type RegisterData } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse {
  errors: any;
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/auth`;
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message,
          errors: data.errors || []
        };
      }

      return data;

    } catch (error) {
      console.error('Login API error:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor',
        errors: error
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message,
          errors: data.errors || []
        };
      }

      return data;

    } catch (error) {
      console.error('Register API error:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor',
        errors: error
      };
    }
  }

  async verifyToken(token: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token verification failed');
      }

      return data;

    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }
}

export const authAPI = new AuthAPI();