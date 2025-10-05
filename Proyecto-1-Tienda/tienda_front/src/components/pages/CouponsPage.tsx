import React, { useState, useEffect } from 'react';
import { useCoupons } from '../../context/CouponContext';
import { useCategories } from '../../context/CategoryContext'; // Importar CategoryContext
import OfferCarousel from '../home/OfferCarousel';
import TopBar from '../home/TopBar';
import { useAuth } from '../../context/AuthContext';
import { Coupon } from '../../types/coupon';

const CouponsPage: React.FC = () => {
  const { 
    coupons, 
    categories: couponCategories, 
    loading, 
    error, 
    selectedCategory,
    fetchAllCoupons, 
    fetchCouponsByCategory,
    clearError
  } = useCoupons();
  
  const { categories: allCategories } = useCategories();
  const { user, logout } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleCategoryChange = (categoryId: number | 'all') => {
    if (categoryId === 'all') {
      fetchAllCoupons();
    } else {
      fetchCouponsByCategory(categoryId as number);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscount = (coupon: Coupon): string => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `$${coupon.discount_value.toLocaleString()} OFF`;
    }
  };

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return 'Todas las categorías';
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoría general';
  };

  const getRemainingDays = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDiscountColor = (discountValue: number, discountType: string): string => {
    if (discountType === 'percentage') {
      if (discountValue >= 20) return 'from-red-500 to-pink-600';
      if (discountValue >= 15) return 'from-orange-500 to-red-500';
      return 'from-green-500 to-emerald-600';
    } else {
      if (discountValue >= 20000) return 'from-red-500 to-pink-600';
      if (discountValue >= 10000) return 'from-orange-500 to-red-500';
      return 'from-green-500 to-emerald-600';
    }
  };

  // Limpiar error cuando se desmonte el componente
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar user={user} onLogout={handleLogout} />
      
      {/* Offer Carousel */}
      <div className="mb-8">
        <OfferCarousel />
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Cupones y Descuentos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre increíbles ofertas y ahorra en tus compras favoritas
          </p>
        </div>

        {/* Filtro por categoría */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Filtra por categoría
              </h2>
              <p className="text-gray-600">
                {coupons.length} cupón{coupons.length !== 1 ? 'es' : ''} disponible{coupons.length !== 1 ? 's' : ''}
                {selectedCategory && ` en ${getCategoryName(selectedCategory)}`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <label htmlFor="category-filter" className="text-lg font-medium text-gray-700 whitespace-nowrap">
                Categoría:
              </label>
              <select
                id="category-filter"
                value={selectedCategory || 'all'}
                onChange={(e) => handleCategoryChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full lg:w-64 border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">🎯 Todas las categorías</option>
                {allCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando cupones...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-red-800">
                  Error al cargar cupones
                </h3>
                <p className="text-red-700 mt-1">
                  {error}
                </p>
                <div className="mt-4">
                  <button
                    onClick={clearError}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de cupones */}
        {!loading && !error && coupons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {coupons.map((coupon) => {
              const remainingDays = getRemainingDays(coupon.end_date);
              const discountColor = getDiscountColor(coupon.discount_value, coupon.discount_type);
              
              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Header del cupón */}
                  <div className={`bg-gradient-to-r ${discountColor} p-6 text-white relative overflow-hidden`}>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <span className="text-3xl font-black block mb-2">
                            {formatDiscount(coupon)}
                          </span>
                          <p className="text-white/90 text-base leading-relaxed">
                            {coupon.description}
                          </p>
                        </div>
                        {coupon.category_name && (
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
                            {coupon.category_name}
                          </span>
                        )}
                      </div>
                      
                      {/* Indicador de tiempo limitado */}
                      {remainingDays <= 7 && (
                        <div className="flex items-center space-x-1 text-white/90 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>
                            {remainingDays <= 0 ? '¡Último día!' : `Solo ${remainingDays} día${remainingDays !== 1 ? 's' : ''}`}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Efecto de brillo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  </div>

                  {/* Código del cupón */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Código del cupón:
                      </span>
                      <div className="flex items-center space-x-3">
                        <code className="bg-gray-50 border-2 border-gray-200 px-4 py-2 rounded-xl text-lg font-mono font-bold text-gray-800 tracking-wider">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center space-x-2"
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del cupón */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Mínimo de compra:</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${coupon.min_purchase_amount.toLocaleString()}
                        </span>
                      </div>
                      
                      {coupon.max_discount_amount && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">Máximo descuento:</span>
                          <span className="text-lg font-bold text-gray-900">
                            ${coupon.max_discount_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Válido hasta:</span>
                        <span className="text-base font-semibold text-gray-900">
                          {new Date(coupon.end_date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {coupon.usage_limit && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">Usos disponibles:</span>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900 block">
                              {coupon.usage_limit - coupon.used_count}
                            </span>
                            <span className="text-sm text-gray-500">
                              de {coupon.usage_limit} cupones
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Barra de progreso para usos */}
                    {coupon.usage_limit && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Usados</span>
                          <span>{Math.round((coupon.used_count / coupon.usage_limit) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(coupon.used_count / coupon.usage_limit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Términos y condiciones */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        * Aplican términos y condiciones. Válido solo para compras en línea.
                        No acumulable con otras promociones.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Estado vacío */}
        {!loading && !error && coupons.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No hay cupones disponibles
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                {selectedCategory 
                  ? `No encontramos cupones para ${getCategoryName(selectedCategory)} en este momento.`
                  : 'No hay cupones activos disponibles en este momento.'
                }
              </p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Ver todos los cupones
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;