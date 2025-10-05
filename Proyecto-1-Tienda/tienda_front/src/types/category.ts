export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  product_count?: number; // Para categorías con productos
}

export interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: number) => Category | null;
  getCategoryByName: (name: string) => Category | null;
  clearError: () => void;
}