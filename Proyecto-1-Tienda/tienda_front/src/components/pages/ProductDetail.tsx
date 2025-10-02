import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import TopBar from '../home/TopBar';
import LoadingSpinner from '../products/LoadingSpinner';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getProductById, loading } = useProducts();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setIsLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  // Si no existe el producto, mostrar estado de carga o error
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopBar user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido removido.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Calcular precio original basado en el descuento
  const originalPrice = product.discount > 0 
    ? product.price / (1 - product.discount / 100)
    : product.price;

  // Usar images del producto
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600x400/6B7280/FFFFFF?text=Imagen+No+Disponible'];

  const handleLogout = () => {
    logout();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log(`Agregado al carrito: ${quantity} x ${product.name}`);
    alert(`¡${quantity} ${product.name}(s) agregado(s) al carrito!`);
  };

  const handleBuyNow = () => {
    console.log(`Comprar ahora: ${quantity} x ${product.name}`);
    // Aquí iría la lógica de compra directa
  };

  const handleContactSeller = () => {
    console.log('Contactar vendedor:', product.seller_id);
    // Aquí iría la lógica para contactar al vendedor
  };

  return (
    <div>
      <TopBar user={user} onLogout={handleLogout} />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Migas de pan */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-600">Inicio</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <Link to="/" className="hover:text-blue-600 capitalize">
                  {product.category_name || 'categoría'}
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Galería de imágenes */}
              <div>
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={productImages[selectedImage]} 
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === index 
                          ? 'border-blue-600 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Vista ${index + 1} de ${product.name}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Información del producto */}
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-2 capitalize">
                    {product.category_name}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                </div>

                {/* Precio y descuento */}
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${Math.round(originalPrice).toLocaleString()}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Información del vendedor */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={product.seller_avatar_url || 'https://via.placeholder.com/40/6B7280/FFFFFF?text=U'} 
                          alt={product.seller_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {product.seller_is_verified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.seller_name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-semibold text-sm">
                              {product.seller_rating ? 
                                (typeof product.seller_rating === 'string' ? 
                                  parseFloat(product.seller_rating).toFixed(1) : 
                                  Number(product.seller_rating).toFixed(1)
                                ) : 'Nuevo'
                              }
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">
                            {product.seller_total_sales ? 
                              (typeof product.seller_total_sales === 'string' ? 
                                parseInt(product.seller_total_sales).toLocaleString() : 
                                Number(product.seller_total_sales).toLocaleString()
                              ) : 0
                            } ventas
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleContactSeller}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Contactar
                    </button>
                  </div>
                </div>

                {/* Características desde JSONB */}
                {product.features && Object.keys(product.features).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Características principales:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(product.features).map(([key, value], index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="text-gray-600 ml-1">{String(value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Etiquetas:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors cursor-default"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de cantidad y acciones */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">Cantidad:</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}</span>
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="flex-1 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{product.stock === 0 ? 'Sin Stock' : 'Comprar Ahora'}</span>
                    </button>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Información adicional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Condición:</span>
                      <span className="text-gray-600 capitalize">
                        {product.condition === 'new' ? 'Nuevo' : 
                         product.condition === 'used' ? 'Usado' : 
                         product.condition === 'refurbished' ? 'Reacondicionado' : 'Nuevo'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Categoría:</span>
                      <span className="text-gray-600 capitalize">{product.category_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Stock:</span>
                      <span className={`font-medium ${
                        product.stock > 10 ? 'text-green-600' :
                        product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.stock} unidades
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Vendedor:</span>
                      <span className="text-gray-600">{product.seller_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;