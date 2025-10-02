import React from 'react';
import { Product } from '../../types/product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Calcular precio original si hay descuento
  const originalPrice = product.discount > 0 
    ? product.price / (1 - product.discount / 100)
    : product.price;

  // Usar la primera imagen del array
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x200/6B7280/FFFFFF?text=Sin+Imagen';

  // Convertir seller_rating a número y manejar valores nulos/undefined
  const sellerRating = product.seller_rating ? 
    typeof product.seller_rating === 'string' ? 
      parseFloat(product.seller_rating) : 
      Number(product.seller_rating) 
    : 0;

  // Asegurar que seller_total_sales sea un número
  const sellerTotalSales = product.seller_total_sales ? 
    typeof product.seller_total_sales === 'string' ? 
      parseInt(product.seller_total_sales) : 
      Number(product.seller_total_sales) 
    : 0;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block"
    >
      <div className="relative">
        <img 
          src={mainImage} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {product.condition === 'new' ? 'Nuevo' : 
           product.condition === 'used' ? 'Usado' : 'Reacondicionado'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          {product.seller_is_verified && (
            <span className="text-blue-500 mr-1" title="Vendedor verificado">
              ✓
            </span>
          )}
          <span className="text-xs text-gray-500 truncate">
            {product.seller_name || 'Vendedor'}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-xs text-gray-600 ml-1">
              {sellerRating > 0 ? sellerRating.toFixed(1) : 'Nuevo'}
            </span>
          </div>
          <span className="text-xs text-gray-500 mx-2">•</span>
          <span className="text-xs text-gray-500">
            {sellerTotalSales > 0 ? `${sellerTotalSales} ventas` : 'Sin ventas'}
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-green-600">
              ${product.price.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${Math.round(originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 10 ? 'bg-green-100 text-green-800' :
            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {product.stock > 10 ? 'Disponible' : 
             product.stock > 0 ? `Solo ${product.stock}` : 'Agotado'}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          disabled={product.stock === 0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Agregar al carrito:', product.id);
          }}
        >
          {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;