// src/services/offer.ts

export interface OfferImage {
  id: string;
  url: string;
}

class OfferService {
  private cloudName: string = 'dypeuv53w';

  /**
   * Método que usa las URLs EXACTAS de Cloudinary con versiones
   */
  async getOfferImages(imageNames: string[]): Promise<OfferImage[]> {
    try {
      console.log('🔄 Iniciando carga de imágenes de ofertas...', imageNames);

      // Probar diferentes formatos
      const formatVariations = ['.webp', '.jpg', '.png', ''];
      
      const images: OfferImage[] = [];

      for (let i = 0; i < imageNames.length; i++) {
        const baseName = imageNames[i];
        
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
          url: workingUrl
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

}

export const offerService = new OfferService();