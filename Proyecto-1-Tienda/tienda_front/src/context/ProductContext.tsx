import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, ProductContextType } from '../types/product';
import { productService } from '../services/product';
import { User } from '../types/user';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar productos';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categoryId: number): Product[] => {
    return products.filter(product => product.category_id === categoryId);
  };

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return products;
    
    const lowercasedQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery) ||
      (product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes(lowercasedQuery)
      )) ||
      (product.category_name && product.category_name.toLowerCase().includes(lowercasedQuery))
    );
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      return await productService.getProductById(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  };

  const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
      return await productService.getFeaturedProducts();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  };

  const searchProductsOnline = async (query: string): Promise<Product[]> => {
    try {
      return await productService.searchProducts(query);
    } catch (error) {
      console.error(`Error searching products online for "${query}":`, error);
      return [];
    }
  };

  const getProductsByCategoryOnline = async (categoryId: number): Promise<Product[]> => {
    try {
      return await productService.getProductsByCategory(categoryId);
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      return [];
    }
  };

  const getSellersByCategory = async (categoryId: number): Promise<User[]> => {
    try {
      return await productService.getSellersByCategory(categoryId);
    } catch (error) {
      console.error(`Error fetching sellers for category ${categoryId}:`, error);
      return [];
    }
  };

  const getProductsByUserId = async (sellerId: number): Promise<Product[]> => {
    try {
      return await productService.getProductsBySeller(sellerId);
    } catch (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      return [];
    }
  };

  const getProductsOnOffer = async (): Promise<Product[]> => {
    try {
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => product.discount > 0);
    } catch (error) {
      console.error('Error fetching products on offer:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductContextType = {
    products,
    loading,
    error,
    fetchProducts,
    getProductsByCategory,
    searchProducts,
    getProductById,
    getFeaturedProducts,
    searchProductsOnline,
    getProductsByCategoryOnline,
    getSellersByCategory,
    getProductsByUserId,
    getProductsOnOffer
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook personalizado para usar el context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};