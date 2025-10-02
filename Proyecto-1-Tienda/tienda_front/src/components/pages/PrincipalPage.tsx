// pages/PrincipalPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import TopBar from '../home/TopBar';
import OfferCarousel from '../home/OfferCarousel';
import LoadingSpinner from '../products/LoadingSpinner';
import { Link } from 'react-router-dom';
import ProductsCarousel from '../products/ProductsSuggestedCarousel';
import ProductsHistoryCarousel from '../products/ProductsHistoryCarousel';
import ProductsSuggestedCarousel from '../products/ProductsSuggestedCarousel';

function PrincipalPage() {
  const { user, logout } = useAuth();
  const { 
    products, 
    loading, 
    error, 
    fetchProducts,
    getFeaturedProducts,
    getProductsByCategory 
  } = useProducts();
  
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);

  // Cargar productos destacados
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };

    loadFeaturedProducts();
  }, [getFeaturedProducts]);

  // Cargar productos por categoría cuando se selecciona una
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (selectedCategory !== null) {
        try {
          const categoryProducts = await getProductsByCategory(selectedCategory);
          setCategoryProducts(categoryProducts);
        } catch (error) {
          console.error('Error loading category products:', error);
        }
      }
    };

    loadCategoryProducts();
  }, [selectedCategory]);

  const handleLogout = () => {
    logout();
  };

  const categories = [
    { id: 1, name: 'Tecnología', icon: '💻' },
    { id: 2, name: 'Moda', icon: '👕' },
    { id: 3, name: 'Hogar', icon: '🏠' },
    { id: 4, name: 'Deportes', icon: '⚽' },
    { id: 5, name: 'Libros', icon: '📚' },
    { id: 6, name: 'Belleza', icon: '💄' },
    { id: 7, name: 'Juguetes', icon: '🧸' },
    { id: 8, name: 'Automotriz', icon: '🚗' }
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopBar user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar productos</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar user={user} onLogout={handleLogout} />
      
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section con Carrusel */}
        <section className="mb-0">
          <OfferCarousel />
        </section>

        <section className="container mx-auto max-w-6xl -mt-10 relative z-10">
          <ProductsHistoryCarousel products={products} loading={loading} />
        </section>

        <section className="container mx-auto mt-[50px] max-w-6xl relative z-10">
          <ProductsSuggestedCarousel products={products} loading={loading} />
        </section>

        {/* Footer Simple */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <p className="text-gray-400">
              © 2024 MercadoLibre Clone. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default PrincipalPage;