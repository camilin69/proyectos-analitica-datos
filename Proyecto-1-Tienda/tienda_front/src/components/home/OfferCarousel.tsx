// OfferCarousel.tsx
import React, { useState, useEffect } from 'react';
import { offerService, OfferImage } from '../../services/offerImages';

interface OfferCarouselProps {
  imageNames?: string[]; // Prop opcional con nombres de imágenes
}

const OfferCarousel: React.FC<OfferCarouselProps> = ({ 
  imageNames = [
    'offer_carousel_1',
    'offer_carousel_2', 
    'offer_carousel_3',
    'offer_carousel_4',
    'offer_carousel_5',
    'offer_carousel_6',
    'offer_carousel_7',
    'offer_carousel_8'
  ] 
}) => {
  const [offers, setOffers] = useState<OfferImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const offerImages = await offerService.getOfferImages(imageNames);
        setOffers(offerImages);
        console.log('✅ Ofertas cargadas exitosamente:', offerImages.length);
      } catch (err) {
        console.error('❌ Error cargando ofertas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []); 

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg">
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative h-64 md:h-72 lg:h-80 xl:h-96 overflow-hidden">
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Imagen principal */}
            <img
              src={offer.url}
              className="w-full h-110 object-cover"
              onError={(e) => {
                console.error('Error cargando imagen:', offer.url);
                const jpgUrl = offer.url.replace('.webp', '.jpg');
                e.currentTarget.src = jpgUrl;
              }}
            />
            
            {/* Gradiente gris que coincide con el fondo de la página */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />
          </div>
        ))}

        {/* Flechas de navegación - Solo visibles en hover */}
        {offers.length > 1 && (
          <>
            {/* Flecha izquierda */}
            <button
              onClick={prevSlide}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-20 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Flecha derecha */}
            <button
              onClick={nextSlide}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-20 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Indicadores mínimos */}
      {offers.length > 1 && (
        <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-sm' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferCarousel;