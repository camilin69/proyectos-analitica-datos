// components/pages/sell/SellPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductContext';
import TopBar from '../../home/TopBar';
import LoadingSpinner from '../../products/LoadingSpinner';

function SellPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchProductsOnline, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchProductsOnline(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setIsTyping(false);
    }
  };

  const handleSellProduct = (productId: string) => {
    navigate(`/sell/product/${productId}`);
  };

  const handleCreateNewProduct = () => {
    navigate('/sell/new-product');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vender Producto</h1>
          <p className="text-gray-600 mb-6">
            Busca un producto existente para vender la misma referencia o crea un nuevo producto desde cero.
          </p>

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsTyping(true);
                  }}
                  placeholder="Buscar productos por nombre, categoría, marca..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!searchQuery.trim() || isSearching}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {/* Resultados de búsqueda */}
          {isSearching && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {searchResults.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resultados de búsqueda ({searchResults.length})
              </h2>
              <div className="grid gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/80/6B7280/FFFFFF?text=Imagen'}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="font-semibold text-green-600">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className="capitalize">{product.condition}</span>
                          <span>{product.category_name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSellProduct(product.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        Vender este Producto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && !isTyping && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button
                onClick={handleCreateNewProduct}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Crear Nuevo Producto "{searchQuery}"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellPage;