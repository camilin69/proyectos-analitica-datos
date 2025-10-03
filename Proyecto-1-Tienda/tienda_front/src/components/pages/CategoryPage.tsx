// components/CategoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import OfferCarousel from '../home/OfferCarousel';
import ProductsSuggestedCarousel from '../products/ProductsSuggestedCarousel';
import ProductCard from '../products/ProductCard';
import TopBar from '../home/TopBar';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/user';
import { Product } from '../../types/product';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { 
    getProductsByCategoryOnline, 
    getSellersByCategory,
    loading, 
    searchProductsOnline 
  } = useProducts();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  const [products, setProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [sellers, setSellers] = useState<User[]>([]);
  const [sellersLoading, setSellersLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000000 });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string>('');

  // Función para formatear el nombre de la categoría para mostrar
  const formatCategoryName = (categorySlug: string): string => {
    const nameMap: { [key: string]: string } = {
      'supermarket': 'Supermercado',
      'tech': 'Tecnología',
      'pharmacy': 'Farmacia',
      'electronics': 'Electrodomésticos',
      'home': 'Hogar y Fitness',
      'beauty': 'Belleza y Cuidado Personal',
      'toys': 'Juegos y Juguetes',
      'automotive': 'Accesorios para Vehículos'
    };
    
    return nameMap[categorySlug] || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  };

  // Función para obtener el ID de categoría basado en el slug
  const getCategoryId = (categorySlug: string): number => {
    const idMap: { [key: string]: number } = {
      'supermarket': 1,
      'tech': 2,
      'pharmacy': 3,
      'electronics': 4,
      'home': 5,
      'beauty': 6,
      'toys': 7,
      'automotive': 8
    };
    
    return idMap[categorySlug] || 0;
  };

  // Cargar productos y marcas cuando cambia la categoría
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryName) return;
      
      setCategoryLoading(true);
      setSellersLoading(true);
      setCategoryDisplayName(formatCategoryName(categoryName));
      
      try {
        let categoryProductsData: any[] = [];
        let sellersData: User[] = [];
        
        // Obtener ID de categoría
        const categoryId = getCategoryId(categoryName);
        
        if (categoryId > 0) {
          // Cargar productos de la categoría
          categoryProductsData = await getProductsByCategoryOnline(categoryId);
          
          // Cargar marcas de la categoría desde la base de datos
          sellersData = await getSellersByCategory(categoryId);
          console.log('Sellers data:', sellersData);
        }
        
        // Si no hay productos por ID, intentar buscar por nombre
        if (categoryProductsData.length === 0) {
          categoryProductsData = await searchProductsOnline(categoryDisplayName);
        }
        setCategoryProducts(categoryProductsData);
        setFilteredProducts(categoryProductsData);
        setProducts(categoryProductsData);
        setSellers(sellersData);
        
      } catch (error) {
        console.error('Error loading category data:', error);
        setCategoryProducts([]);
        setFilteredProducts([]);
        setSellers([]);
      } finally {
        setCategoryLoading(false);
        setSellersLoading(false);
      }
    };

    loadCategoryData();
  }, []);


  // Aplicar filtros cuando cambian
  useEffect(() => {
    let filtered = [...categoryProducts];
    
    // Filtrar por rango de precio
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Ordenar productos
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        // Mantener orden por relevancia (como vienen del servidor)
        break;
    }
    
    setFilteredProducts(filtered);
  }, [categoryProducts, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar user={user} onLogout={handleLogout} />
      
      {/* Offer Carousel */}
      <div className="mb-6">
        <OfferCarousel />
      </div>

      {/* Marcas reconocidas - Solo mostrar si hay marcas */}
      {sellers.length > 0 && (
        <div className="bg-white rounded-[2px] p-6 mb-6 w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vendedores en {categoryDisplayName}
          </h2>
          {sellersLoading ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-24 h-20 border border-gray-200 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mb-2"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {sellers.map((seller, index) => (
                <Link
                  key={index}
                  to={seller.id === user?.id ? `/profile` :`/profile/${seller.id}`}
                  className="flex flex-col items-center justify-center w-24 h-20 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer group no-underline"
                  title={seller.name}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-50 transition-colors duration-200 overflow-hidden">
                    {seller.avatar_url ? (
                      <img 
                        src={seller.avatar_url} 
                        alt={seller.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">
                        {seller.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium truncate w-20">
                    {seller.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Productos sugeridos */}
      <div className="mb-6">
        <ProductsSuggestedCarousel
          products={categoryProducts.slice(0, 12)}
          loading={categoryLoading}
          title={`${categoryDisplayName} - Productos destacados`}
        />
      </div>

      {/* Todos los productos de la categoría con filtros */}
      <div className="bg-white rounded-[2px] p-6 w-full max-w-6xl mx-auto">
        {/* Header con título y filtros */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryDisplayName}
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} productos encontrados
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Filtro por orden */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select 
                className="border border-gray-300 rounded p-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Más relevantes</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
            
            {/* Rango de precio */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Precio:</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Mín"
                  className="w-20 border border-gray-300 rounded p-1 text-sm"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ 
                    ...prev, 
                    min: Number(e.target.value) 
                  }))}
                />
                <span className="text-gray-400 flex items-center">-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  className="w-20 border border-gray-300 rounded p-1 text-sm"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ 
                    ...prev, 
                    max: Number(e.target.value) 
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {categoryLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg w-full h-80"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">😔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-600">
              No encontramos productos en esta categoría con los filtros aplicados.
            </p>
            <button
              onClick={() => {
                setPriceRange({ min: 0, max: 10000000 });
                setSortBy('relevance');
              }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Paginación básica */}
        {filteredProducts.length > 24 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;