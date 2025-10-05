import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import OfferCarousel from '../home/OfferCarousel';
import ProductsSuggestedCarousel from '../products/ProductsSuggestedCarousel';
import ProductCard from '../products/ProductCard';
import TopBar from '../home/TopBar';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/user';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { 
    getProductsByCategoryOnline, 
    getSellersByCategory,
    loading, 
    searchProductsOnline 
  } = useProducts();
  
  const { categories } = useCategories();
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
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Función para obtener la categoría desde la base de datos
  const getCategoryFromDatabase = (categorySlug: string): { id: number; name: string } | null => {
    if (!categorySlug || categories.length === 0) return null;
    
    // Primero intentar buscar por slug exacto (convertir nombre a slug)
    const categoryWithSlug = categories.map(cat => ({
      ...cat,
      slug: cat.name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }));

    // Buscar por slug exacto
    const exactMatch = categoryWithSlug.find(cat => 
      cat.slug === categorySlug.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;

    // Si no hay match exacto, buscar por nombre que contenga el slug
    const partialMatch = categoryWithSlug.find(cat => 
      cat.name.toLowerCase().includes(categorySlug.toLowerCase()) ||
      categorySlug.toLowerCase().includes(cat.name.toLowerCase())
    );

    return partialMatch || null;
  };

  // Función para formatear el nombre de la categoría para mostrar
  const formatCategoryName = (categorySlug: string): string => {
    const category = getCategoryFromDatabase(categorySlug);
    return category ? category.name : 'Categoría no encontrada';
  };

  // Función para obtener el ID de categoría basado en el slug
  const getCategoryId = (categorySlug: string): number => {
    const category = getCategoryFromDatabase(categorySlug);
    return category ? category.id : 0;
  };

  // Cargar productos y marcas cuando cambia la categoría
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryName) return;
      
      setCategoryLoading(true);
      setSellersLoading(true);
      setCategoryError(null);
      
      const category = getCategoryFromDatabase(categoryName);
      
      if (!category) {
        setCategoryError(`Categoría "${categoryName}" no encontrada`);
        setCategoryDisplayName('Categoría no encontrada');
        setCategoryId(null);
        setCategoryProducts([]);
        setSellers([]);
        setCategoryLoading(false);
        setSellersLoading(false);
        return;
      }

      const displayName = category.name;
      const catId = category.id;
      
      setCategoryDisplayName(displayName);
      setCategoryId(catId);
      
      console.log('Loading category data:', {
        categoryName,
        displayName,
        catId,
        foundCategory: category
      });
      
      try {
        let categoryProductsData: any[] = [];
        let sellersData: User[] = [];
        
        // Cargar productos de la categoría
        categoryProductsData = await getProductsByCategoryOnline(catId);
        
        // Cargar vendedores de la categoría desde la base de datos
        sellersData = await getSellersByCategory(catId);
        
        // Si no hay productos por ID, intentar buscar por nombre
        if (categoryProductsData.length === 0) {
          console.log('No products found by ID, searching by name:', displayName);
          categoryProductsData = await searchProductsOnline(displayName);
        }
        
        setCategoryProducts(categoryProductsData);
        setFilteredProducts(categoryProductsData);
        setProducts(categoryProductsData);
        setSellers(sellersData);
        
      } catch (error) {
        console.error('Error loading category data:', error);
        setCategoryError('Error al cargar los datos de la categoría');
        setCategoryProducts([]);
        setFilteredProducts([]);
        setSellers([]);
      } finally {
        setCategoryLoading(false);
        setSellersLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryName, categories]);

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

      {/* Error de categoría no encontrada */}
      {categoryError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Categoría no encontrada
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {categoryError}
              </p>
              <Link 
                to="/"
                className="mt-2 inline-block text-sm text-red-800 hover:text-red-900 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Marcas reconocidas - Solo mostrar si hay vendedores y no hay error */}
      {!categoryError && sellers.length > 0 && (
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
                  key={seller.id}
                  to={seller.id === user?.id ? `/profile` : `/profile/${seller.id}`}
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

      {/* Productos sugeridos - Solo mostrar si no hay error */}
      {!categoryError && (
        <div className="mb-6">
          <ProductsSuggestedCarousel
            products={categoryProducts.slice(0, 12)}
            loading={categoryLoading}
            title={`${categoryDisplayName} - Productos destacados`}
          />
        </div>
      )}

      {/* Todos los productos de la categoría con filtros - Solo mostrar si no hay error */}
      {!categoryError && (
        <div className="bg-white rounded-[2px] p-6 w-full max-w-6xl mx-auto">
          {/* Header con título y filtros */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categoryDisplayName}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} productos encontrados
                {categoryId && ` (ID: ${categoryId})`}
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
      )}
    </div>
  );
};

export default CategoryPage;