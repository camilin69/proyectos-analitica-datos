export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  category_id: number | null;
  category_name?: string;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponContextType {
  // Estado
  coupons: Coupon[];
  categories: any[];
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
  
  // Acciones
  fetchAllCoupons: () => Promise<void>;
  fetchCouponsByCategory: (categoryId: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  validateCoupon: (code: string) => Promise<Coupon>;
  useCoupon: (couponId: number) => Promise<void>;
  getFeaturedCoupons: () => Promise<Coupon[]>;
  getExpiringCoupons: () => Promise<Coupon[]>;
  setSelectedCategory: (categoryId: number | null) => void;
  clearError: () => void;
}