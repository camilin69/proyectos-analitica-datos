import type { Coupon } from '../types/coupon';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

class CouponService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/coupons`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAllCoupons(): Promise<Coupon[]> {
    try {
      const response = await fetch(`${this.baseURL}`);
      const result: ApiResponse<Coupon[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  }

  async getCouponsByCategory(categoryId: number): Promise<Coupon[]> {
    try {
      const response = await fetch(`${this.baseURL}/category/${categoryId}`);
      const result: ApiResponse<Coupon[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching coupons for category ${categoryId}:`, error);
      throw error;
    }
  }

  async getCategoriesWithCoupons(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/categories`);
      const result: ApiResponse<any[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching categories with coupons:', error);
      throw error;
    }
  }

  async validateCoupon(code: string): Promise<Coupon> {
    try {
      const response = await fetch(`${this.baseURL}/code/${encodeURIComponent(code)}`);
      const result: ApiResponse<Coupon> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Error validating coupon ${code}:`, error);
      throw error;
    }
  }

  async useCoupon(couponId: number, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/use/${couponId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      await this.handleResponse(response);
    } catch (error) {
      console.error(`Error using coupon ${couponId}:`, error);
      throw error;
    }
  }

  async getFeaturedCoupons(limit: number = 6): Promise<Coupon[]> {
    try {
      const response = await fetch(`${this.baseURL}/featured?limit=${limit}`);
      const result: ApiResponse<Coupon[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching featured coupons:', error);
      throw error;
    }
  }

  async getExpiringCoupons(days: number = 7): Promise<Coupon[]> {
    try {
      const response = await fetch(`${this.baseURL}/expiring?days=${days}`);
      const result: ApiResponse<Coupon[]> = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching expiring coupons:', error);
      throw error;
    }
  }
}

export const couponService = new CouponService();