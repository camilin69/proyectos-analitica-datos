import React, { useState } from 'react';
import { Product } from '../../types/product';
import ProductCard from './ProductCard';

interface ProductsSuggestedCarouselProps {
  products: Product[];
  loading: boolean;
  title?: string;
}

const ProductsSuggestedCarousel: React.FC<ProductsSuggestedCarouselProps> = ({ 
  products, 
  loading, 
  title = "Sugeridos para ti" 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const productsPerSlide = 6;
  const maxSlides = 4;

  // Calcular el número total de slides (máximo 4)
  const totalSlides = Math.min(Math.ceil(products.length / productsPerSlide), maxSlides);

  // Obtener todos los slides
  const getAllSlides = () => {
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
      const startIndex = i * productsPerSlide;
      slides.push(products.slice(startIndex, startIndex + productsPerSlide));
    }
    return slides;
  };

  const slides = getAllSlides();

  const nextSlide = async () => {
    if (currentSlide < totalSlides - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = async () => {
    if (currentSlide > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToSlide = (index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Determinar si mostrar flechas
  const showPrevArrow = totalSlides > 1 && currentSlide > 0;
  const showNextArrow = totalSlides > 1 && currentSlide < totalSlides - 1;

  if (loading) {
    return (
      <div className="bg-white rounded-[2px] p-6 w-full max-w-6xl mx-auto">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg w-full h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-[2px] p-6 w-full max-w-6xl mx-auto text-center py-8">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2px] p-6 w-full max-w-6xl mx-auto">
      <div className="space-y-6">
        {/* Header con título y indicadores */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          
          {/* Indicadores de slide - solo mostrar si hay más de 1 slide */}
          {totalSlides > 1 && (
            <div className="flex space-x-1.5">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contenedor del carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out"
                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slideProducts, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {slideProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas de navegación - Solo mostrar cuando sea necesario */}
          {showPrevArrow && (
            <button
              onClick={prevSlide}
              className="absolute -left-14 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-4 hover:shadow-xl hover:bg-gray-50 transition-all duration-300 z-10 border border-gray-200"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="blue" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {showNextArrow && (
            <button
              onClick={nextSlide}
              className="absolute -right-14 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-4 hover:shadow-xl hover:bg-gray-50 transition-all duration-300 z-10 border border-gray-200"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="blue" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSuggestedCarousel;