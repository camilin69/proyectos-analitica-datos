import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Coupon, CouponContextType } from '../types/coupon';
import { couponService } from '../services/coupon';
import { useAuth } from './AuthContext';

const CouponContext = createContext<CouponContextType | undefined>(undefined);

interface CouponProviderProps {
  children: ReactNode;
}

export const CouponProvider: React.FC<CouponProviderProps> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const { token } = useAuth();

  const fetchAllCoupons = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const couponsData = await couponService.getAllCoupons();
      setCoupons(couponsData);
      setSelectedCategory(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar cupones';
      setError(errorMessage);
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponsByCategory = async (categoryId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const couponsData = await couponService.getCouponsByCategory(categoryId);
      setCoupons(couponsData);
      setSelectedCategory(categoryId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar cupones por categoría';
      setError(errorMessage);
      console.error('Error fetching coupons by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const categoriesData = await couponService.getCategoriesWithCoupons();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories with coupons:', error);
      setCategories([]);
    }
  };

  const validateCoupon = async (code: string): Promise<Coupon> => {
    try {
      return await couponService.validateCoupon(code);
    } catch (error) {
      console.error(`Error validating coupon ${code}:`, error);
      throw error;
    }
  };

  const useCoupon = async (couponId: number): Promise<void> => {
    try {
      if (!token) {
        throw new Error('Usuario no autenticado');
      }
      await couponService.useCoupon(couponId, token);
    } catch (error) {
      console.error(`Error using coupon ${couponId}:`, error);
      throw error;
    }
  };

  const getFeaturedCoupons = async (): Promise<Coupon[]> => {
    try {
      return await couponService.getFeaturedCoupons();
    } catch (error) {
      console.error('Error fetching featured coupons:', error);
      return [];
    }
  };

  const getExpiringCoupons = async (): Promise<Coupon[]> => {
    try {
      return await couponService.getExpiringCoupons();
    } catch (error) {
      console.error('Error fetching expiring coupons:', error);
      return [];
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const handleSetSelectedCategory = (categoryId: number | null): void => {
    setSelectedCategory(categoryId);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchAllCoupons();
      await fetchCategories();
    };

    loadInitialData();
  }, []);

  const value: CouponContextType = {
    coupons,
    categories,
    loading,
    error,
    selectedCategory,
    fetchAllCoupons,
    fetchCouponsByCategory,
    fetchCategories,
    validateCoupon,
    useCoupon,
    getFeaturedCoupons,
    getExpiringCoupons,
    setSelectedCategory: handleSetSelectedCategory,
    clearError
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

// Hook personalizado para usar el context
export const useCoupons = (): CouponContextType => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons debe ser usado dentro de un CouponProvider');
  }
  return context;
};