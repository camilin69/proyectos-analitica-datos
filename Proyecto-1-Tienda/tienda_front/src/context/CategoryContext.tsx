import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Category, CategoryContextType } from '../types/category';
import { categoryService } from '../services/category';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryService.getAllCategories();
      console.log('Fetched categories:', categoriesData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar categorías';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = (id: number): Category | null => {
    return categories.find(category => category.id === id) || null;
  };

  const getCategoryByName = (name: string): Category | null => {
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    ) || null;
  };

  const clearError = (): void => {
    setError(null);
  };

  // Cargar categorías al inicializar
  useEffect(() => {
    fetchCategories();
  }, []);

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoryByName,
    clearError
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook personalizado para usar el context
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories debe ser usado dentro de un CategoryProvider');
  }
  return context;
};