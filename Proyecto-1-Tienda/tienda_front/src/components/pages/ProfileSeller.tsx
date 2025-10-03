// components/pages/ProfileSeller.tsx
import React, { useState, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import TopBar from '../home/TopBar';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../products/ProductCard';
import { User } from '../../types/user';
import { Product } from '../../types/product';

const ProfileSeller: React.FC = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const { getProductsByUserId, loading } = useProducts();
    const { user, findUserById, logout } = useAuth();

    const [sellerInfo, setSellerInfo] = useState<User | null>(null);
    const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState<boolean>(true);

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        const loadSellerData = async () => {
            if (!sellerId) return;

            setProductsLoading(true);
            try {
                const products = await getProductsByUserId(parseInt(sellerId));
                setSellerProducts(products);
                
                // Extraer información del vendedor del primer producto
                if (products.length > 0) {
                    const seller = await findUserById(products[0].seller_id);
                    if (seller) {
                    setSellerInfo(seller);
                    return;
                    }
                    setSellerInfo(null);
                }
            } catch (error) {
                console.error('Error loading seller data:', error);
                setSellerProducts([]);
                setSellerInfo(null);
            } finally {
                setProductsLoading(false);
            }
        };
        loadSellerData();

    }, []);
    

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar user={user} onLogout={handleLogout} />
      
      {/* Banner del vendedor */}
      <div className="bg-white rounded-[2px] p-6 mb-6 w-full max-w-6xl mx-auto mt-4">
        {sellerInfo ? (
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-blue-500">
                {sellerInfo.avatar_url ? (
                  <img 
                    src={sellerInfo.avatar_url} 
                    alt={sellerInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {sellerInfo.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Información del vendedor */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {sellerInfo.name}
                </h1>
                {sellerInfo.is_verified && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Verificado
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 max-w-2xl">
                {sellerInfo.bio || `Vendedor con ${sellerProducts.length} productos disponibles`}
              </p>

              {/* Stats del vendedor */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {sellerProducts.length}
                  </div>
                  <div className="text-sm text-gray-500">Productos</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {sellerInfo.total_sales || 0}
                  </div>
                  <div className="text-sm text-gray-500">Ventas</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {sellerInfo.rating || '5.0'}
                  </div>
                  <div className="text-sm text-gray-500">Calificación</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vendedor no encontrado
            </h3>
            <p className="text-gray-600">
              No pudimos cargar la información de este vendedor.
            </p>
          </div>
        )}
      </div>

      {/* Productos del vendedor */}
      <div className="bg-white rounded-[2px] p-6 w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Productos de {sellerInfo?.name || 'este vendedor'}
        </h2>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg w-full h-80"></div>
            ))}
          </div>
        ) : sellerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {sellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-600">
              Este vendedor no tiene productos publicados actualmente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSeller;