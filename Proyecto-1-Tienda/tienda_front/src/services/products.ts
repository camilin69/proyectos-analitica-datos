import type { Product } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  query?: string;
}

export interface ProductsResponse {
  products: Product[];
  count: number;
}

export interface ProductResponse {
  product: Product;
}

class ProductService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/products`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Obtener todos los productos
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}`);
      const result: ApiResponse<Product[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      const result: ApiResponse<Product> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Obtener productos por categoría
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/category/${categoryId}`);
      const result: ApiResponse<Product[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  // Obtener productos por vendedor
  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/seller/${sellerId}`);
      const result: ApiResponse<Product[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      throw error;
    }
  }

  // Buscar productos
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/search?q=${encodeURIComponent(query)}`);
      const result: ApiResponse<Product[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error searching products for "${query}":`, error);
      throw error;
    }
  }

  // Obtener productos destacados
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/featured`);
      const result: ApiResponse<Product[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Crear producto (requiere autenticación)
  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const result: ApiResponse<Product> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Actualizar producto (requiere autenticación)
  async updateProduct(id: string, productData: Partial<Product>, token: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const result: ApiResponse<Product> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  // Eliminar producto (requiere autenticación)
  async deleteProduct(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await this.handleResponse(response);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
}

export const productService = new ProductService();