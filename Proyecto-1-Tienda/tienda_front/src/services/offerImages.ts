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

      // Probar diferentes formatos
      const formatVariations = ['.webp', '.jpg', '.png', ''];
      
      const cloudinaryBaseUrls = [
        'offer_carousel_1',
        'offer_carousel_2', 
        'offer_carousel_3',
        'offer_carousel_4',
        'offer_carousel_5',
        'offer_carousel_6',
        'offer_carousel_7',
        'offer_carousel_8'
      ];

      const images: OfferImage[] = [];

      for (let i = 0; i < cloudinaryBaseUrls.length; i++) {
        const baseName = cloudinaryBaseUrls[i];
        
        // Probar diferentes formatos hasta encontrar uno que funcione
        let workingUrl = '';
        for (const format of formatVariations) {
          const testUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload/${baseName}${format}`;
          
          try {
            const exists = await this.checkImageExists(testUrl);
            if (exists) {
              workingUrl = testUrl;
              console.log(`✅ Formato encontrado para ${baseName}: ${format || 'sin extensión'}`);
              break;
            }
          } catch (error) {
            // Continuar con el siguiente formato
          }
        }

        // Si no encontramos un formato que funcione, usar la URL base
        if (!workingUrl) {
          workingUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload/${baseName}`;
          console.warn(`⚠️ Usando URL base para ${baseName}`);
        }

        images.push({
          id: baseName,
          url: workingUrl,
          alt: this.generateAltText(i),
          title: this.generateTitle(i),
          description: this.generateDescription(i)
        });
      }

      console.log(`🎉 ${images.length} imágenes procesadas`);
      return images;

    } catch (error) {
      console.error('❌ Error cargando imágenes de ofertas:', error);
      return [];
    }
  }
  private async checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
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