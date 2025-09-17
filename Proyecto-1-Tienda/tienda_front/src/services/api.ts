// services/api.ts
import { type RegisterData } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
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

      return await response.json();
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, message: 'Error de conexión' };
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

      return await response.json();
    } catch (error) {
      console.error('Register API error:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }
}

export const authAPI = new AuthAPI();