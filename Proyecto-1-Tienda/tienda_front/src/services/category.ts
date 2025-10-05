import type { Category } from '../types/category';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

class CategoryService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/categories`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Obtener todas las categorías
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=600' // Cache de 10 minutos
        }
      });
      const result: ApiResponse<Category[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Obtener categoría por ID
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await fetch(`${this.baseURL}/id/${id}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=300'
        }
      });
      const result: ApiResponse<Category> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  // Obtener categoría por nombre
  async getCategoryByName(name: string): Promise<Category> {
    try {
      const response = await fetch(`${this.baseURL}/name/${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=300'
        }
      });
      const result: ApiResponse<Category> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching category ${name}:`, error);
      throw error;
    }
  }

  // Obtener categorías con productos
  async getCategoriesWithProducts(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseURL}/with-products`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=300'
        }
      });
      const result: ApiResponse<Category[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching categories with products:', error);
      throw error;
    }
  }

  // Crear categoría (requiere autenticación)
  async createCategory(categoryData: Omit<Category, 'id' | 'created_at'>, token: string): Promise<Category> {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });
      const result: ApiResponse<Category> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Actualizar categoría (requiere autenticación)
  async updateCategory(id: number, categoryData: Partial<Category>, token: string): Promise<Category> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });
      const result: ApiResponse<Category> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  // Eliminar categoría (requiere autenticación)
  async deleteCategory(id: number, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await this.handleResponse(response);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();