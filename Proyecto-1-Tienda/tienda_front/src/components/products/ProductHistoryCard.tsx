import React from 'react';
import { Product } from '../../types/product';
import { Link } from 'react-router-dom';

interface ProductHistoryCardProps {
  product: Product;
  title?: string;
  category?: string;
}

const ProductHistoryCard: React.FC<ProductHistoryCardProps> = ({ 
  product, 
  title = "Compra tuyo",
}) => {
  // Usar la primera imagen del array
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x200/6B7280/FFFFFF?text=Sin+Imagen';

  // Función para formatear precios en formato colombiano
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="bg-white w-[183px] h-[300px] overflow-hidden group flex flex-col border border-gray-200 rounded-[5px]"
    >
      {/* Header con título */}
      <div className="bg-gray-50 p-4 ">
        <p className="text-[16px] font-bold text-gray-700 truncate">{title}</p>
      </div>

      {/* Imagen - Más pequeña */}
      <div className="relative flex-shrink-0 px-2">
        <img 
          src={mainImage} 
          alt={product.name}
          className="w-full object-contain"
        />
      </div>
      
      {/* Contenido de texto */}
      <div className="flex-1 py-6 px-2 flex flex-col min-h-0">
        {/* Nombre con altura fija de 2 líneas */}
        <div className="mb-1 min-h-[40px] flex items-start">
          <p className="text-[14px] group-hover:text-blue-600 transition-colors duration-200 overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineClamp: 2,
              boxOrient: 'vertical'
            }}>
            {product.name}
          </p>
        </div>

        {/* Solo precio actual */}
        <div className="mt-auto">
          <span className="text-[18px] font-semi-bold text-black">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.discount > 0 && (
              <span className="text-xs text-green-500 ">
                {product.discount}% OFF
              </span>
            )}
      </div>
    </Link>
  );
};

export default ProductHistoryCard;