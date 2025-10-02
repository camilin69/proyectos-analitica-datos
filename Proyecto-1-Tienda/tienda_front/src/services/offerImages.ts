// src/services/offer.ts

export interface OfferImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

class OfferService {
  private cloudName: string = 'dypeuv53w';

  /**
   * Método que usa las URLs EXACTAS de Cloudinary con versiones
   */
  async getOfferImages(): Promise<OfferImage[]> {
    try {
      console.log('🔄 Iniciando carga de imágenes de ofertas...');

      // URLs EXACTAS de Cloudinary con versiones incluidas
      const cloudinaryUrls = [
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177162/offer_carousel_1.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177162/offer_carousel_2.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177161/offer_carousel_3.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177161/offer_carousel_4.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177161/offer_carousel_5.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177161/offer_carousel_6.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177161/offer_carousel_7.webp',
        'https://res.cloudinary.com/dypeuv53w/image/upload/v1759177161/offer_carousel_8.webp'
      ];

      const images: OfferImage[] = cloudinaryUrls.map((url, index) => {
        console.log(`✅ URL ${index + 1}:`, url);
        
        return {
          id: `offer_carousel_${index + 1}`,
          url: url,
          alt: this.generateAltText(index),
          title: this.generateTitle(index),
          description: this.generateDescription(index)
        };
      });

      console.log(`🎉 ${images.length} URLs de Cloudinary procesadas correctamente`);
      return images;

    } catch (error) {
      console.error('❌ Error cargando imágenes de ofertas:', error);
      return [];
    }
  }

  /**
   * Genera texto alternativo
   */
  private generateAltText(index: number): string {
    const names = [
      'Oferta de Tecnología',
      'Oferta de Moda',
      'Oferta de Hogar',
      'Oferta de Deportes',
      'Oferta de Electrónicos',
      'Oferta de Belleza',
      'Oferta de Juguetes',
      'Oferta de Automotriz'
    ];
    return names[index] || `Oferta especial ${index + 1}`;
  }

  /**
   * Genera título
   */
  private generateTitle(index: number): string {
    const titles = [
      'Tecnología en Oferta',
      'Moda en Rebaja',
      'Hogar y Decoración',
      'Equipamiento Deportivo',
      'Electrónicos en Oferta',
      'Belleza y Cuidado',
      'Juguetes y Diversión',
      'Accesorios Automotrices'
    ];
    return titles[index] || `Oferta Especial ${index + 1}`;
  }

  /**
   * Genera descripción
   */
  private generateDescription(index: number): string {
    const descriptions = [
      'Hasta 40% de descuento en smartphones y laptops',
      'Ropa y accesorios con hasta 50% de descuento',
      'Muebles y decoración con grandes descuentos',
      'Todo para tu entrenamiento con 30% de descuento',
      'Los mejores precios en gadgets y dispositivos',
      'Productos de belleza con descuentos exclusivos',
      'Diversión para todas las edades con descuento',
      'Todo para tu vehículo con precios especiales'
    ];
    return descriptions[index] || 'Descuentos exclusivos por tiempo limitado';
  }
}

export const offerService = new OfferService();