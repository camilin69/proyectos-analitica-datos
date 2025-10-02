// OfferCarousel.tsx
import React, { useState, useEffect } from 'react';
import { offerService, OfferImage } from '../../services/offerImages';

const OfferCarousel: React.FC = () => {
  const [offers, setOffers] = useState<OfferImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        
        const offerImages = await offerService.getOfferImages();
        setOffers(offerImages);
        
        console.log('✅ Ofertas cargadas exitosamente:', offerImages.length);
        console.log('📸 URLs de las imágenes:', offerImages.map(img => img.url));
        
      } catch (err) {
        console.error('❌ Error cargando ofertas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (offers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleImageLoad = (url: string, index: number) => {
    console.log(`✅ Imagen ${index + 1} cargada correctamente`);
  };

  const handleImageError = (url: string, index: number) => {
    console.error(`❌ Error cargando imagen ${index + 1}:`, url);
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Cargando ofertas...</div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p>No hay ofertas disponibles</p>
          <p className="text-sm">Próximamente tendremos grandes descuentos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg">
      {/* Carousel Container */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Imagen */}
            <img
              src={offer.url}
              alt={offer.alt}
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(offer.url, index)}
              onError={() => handleImageError(offer.url, index)}
            />
            
            {/* Overlay con información */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
              <div className="text-white p-8 max-w-md">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {offer.title}
                </h2>
                <p className="text-lg md:text-xl mb-4">
                  {offer.description}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Ver Ofertas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {offers.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OfferCarousel;