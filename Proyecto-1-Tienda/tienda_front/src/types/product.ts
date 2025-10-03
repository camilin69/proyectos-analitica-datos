import { User, Address } from './user';
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  seller_id: number;
  stock: number;
  images: string[];
  condition: 'new' | 'used' | 'refurbished' | string;
  tags: string[];
  description: string;
  category_id: number;
  features: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Campos desde JOINs (opcionales)
  seller_name?: string;
  seller_rating?: number | string; // Puede venir como string desde la BD
  seller_total_sales?: number | string; // Puede venir como string desde la BD
  seller_avatar_url?: string;
  seller_is_verified?: boolean;
  category_name?: string;
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductsByCategory: (categoryId: number) => Product[];
  searchProducts: (query: string) => Product[];
  // Nuevas funciones
  getProductById: (id: string) => Promise<Product | null>;
  getFeaturedProducts: () => Promise<Product[]>;
  searchProductsOnline: (query: string) => Promise<Product[]>;
  getProductsByCategoryOnline: (categoryId: number) => Promise<Product[]>;
  getSellersByCategory: (categoryId: number) => Promise<User[]>;
  getProductsByUserId: (sellerId: number) => Promise<Product[]>;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface UserFavorite {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product?: Product; // Joined data
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  shipping_address: Address;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[]; // Joined data
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product?: Product; // Joined data
}
