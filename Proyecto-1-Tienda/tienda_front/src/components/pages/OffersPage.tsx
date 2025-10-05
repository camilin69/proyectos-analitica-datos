import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import OfferCarousel from '../../components/home/OfferCarousel';
import ProductCard from '../../components/products/ProductCard';
import type { Product } from '../../types/product';
import TopBar from '../home/TopBar';
import { useAuth } from '../../context/AuthContext';

// Definir las opciones de ordenamiento
export const SORT_OPTIONS = {
  DEFAULT: { value: 'default', label: 'Recomendados' },
  DISCOUNT_DESC: { value: 'discount_desc', label: 'Mayor descuento' },
  PRICE_ASC: { value: 'price_asc', label: 'Menor precio' },
  PRICE_DESC: { value: 'price_desc', label: 'Mayor precio' },
  NAME_ASC: { value: 'name_asc', label: 'Nombre A-Z' },
  NAME_DESC: { value: 'name_desc', label: 'Nombre Z-A' },
  RECENT: { value: 'recent', label: 'Más recientes' }
} as const;

// Tipo para las opciones de ordenamiento
export type SortOption = keyof typeof SORT_OPTIONS;

const OffersPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { getProductsOnOffer } = useProducts();
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el ordenamiento seleccionado
  const [selectedSort, setSelectedSort] = useState<SortOption>('DEFAULT');

  useEffect(() => {
    const loadOfferProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await getProductsOnOffer();
        setOfferProducts(products);
      } catch (err) {
        setError('Error al cargar los productos en oferta');
        console.error('Error loading offer products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOfferProducts();
  }, [getProductsOnOffer]);

  // Función para manejar el cambio en el combobox
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(event.target.value as SortOption);
  };

  // Función para ordenar los productos basado en la selección
  const sortedProducts = useMemo(() => {
    const productsWithDiscount = offerProducts.filter(product => 
      product.discount > 0
    );

    switch (selectedSort) {
      case 'DISCOUNT_DESC':
        return [...productsWithDiscount].sort((a, b) => b.discount - a.discount);
      
      case 'PRICE_ASC':
        return [...productsWithDiscount].sort((a, b) => {
          const priceA = a.price * (1 - a.discount / 100);
          const priceB = b.price * (1 - b.discount / 100);
          return priceA - priceB;
        });
      
      case 'PRICE_DESC':
        return [...productsWithDiscount].sort((a, b) => {
          const priceA = a.price * (1 - a.discount / 100);
          const priceB = b.price * (1 - b.discount / 100);
          return priceB - priceA;
        });
      
      case 'NAME_ASC':
        return [...productsWithDiscount].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      
      case 'NAME_DESC':
        return [...productsWithDiscount].sort((a, b) => 
          b.name.localeCompare(a.name)
        );
      
      case 'RECENT':
        return [...productsWithDiscount].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      
      case 'DEFAULT':
      default:
        // Orden por defecto: mayor descuento primero, luego por precio con descuento
        return [...productsWithDiscount].sort((a, b) => {
          // Primero por descuento (mayor a menor)
          if (b.discount !== a.discount) {
            return b.discount - a.discount;
          }
          // Si tienen el mismo descuento, por precio con descuento (menor a mayor)
          const priceA = a.price * (1 - a.discount / 100);
          const priceB = b.price * (1 - b.discount / 100);
          return priceA - priceB;
        });
    }
  }, [offerProducts, selectedSort]);

  // Calcular estadísticas de los productos
  const productsStats = useMemo(() => {
    const productsWithDiscount = offerProducts.filter(product => product.discount > 0);
    
    if (productsWithDiscount.length === 0) {
      return { averageDiscount: 0, maxDiscount: 0, minPrice: 0 };
    }

    const discounts = productsWithDiscount.map(p => p.discount);
    const pricesWithDiscount = productsWithDiscount.map(p => 
      p.price * (1 - p.discount / 100)
    );

    return {
      averageDiscount: Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length),
      maxDiscount: Math.max(...discounts),
      minPrice: Math.min(...pricesWithDiscount)
    };
  }, [offerProducts]);

  const handleLogout = () => {
    logout();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar user={user} onLogout={handleLogout} />
      {/* Carousel de ofertas */}
      <div className="mb-8">
        <OfferCarousel />
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la página */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ofertas Especiales
          </h1>
          <p className="text-gray-600">
            Descubre los mejores productos con descuentos exclusivos
          </p>
          
          {/* Estadísticas rápidas */}
          {!loading && sortedProducts.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                🔥 {productsStats.averageDiscount}% de descuento promedio
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                💰 Hasta {productsStats.maxDiscount}% OFF
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                ⚡ Desde ${productsStats.minPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar ofertas
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de productos en oferta */}
        {!loading && !error && (
          <>
            {/* Barra de herramientas: contador y filtros */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-gray-600 font-medium">
                  {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''} en oferta
                </p>
                
                {/* Indicador de ordenamiento activo */}
                {selectedSort !== 'DEFAULT' && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {SORT_OPTIONS[selectedSort].label}
                  </span>
                )}
              </div>
              
              {/* Combobox de ordenamiento */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap">
                  Ordenar por:
                </label>
                <select
                  id="sort-select"
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                >
                  {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid de productos */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              /* Estado vacío */
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay ofertas disponibles
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No encontramos productos con descuento en este momento.
                </p>
              </div>
            )}
          </>
        )}

        {/* Banner promocional al final */}
        {!loading && sortedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-800">
                    ¡Aprovecha estas ofertas!
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Productos seleccionados con descuentos exclusivos por tiempo limitado.
                  </p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
                Ver todas las categorías
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;