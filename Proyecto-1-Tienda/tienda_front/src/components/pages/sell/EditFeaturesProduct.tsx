// components/pages/sell/EditFeaturesProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductContext';
import { useCategories } from '../../../context/CategoryContext';
import TopBar from '../../home/TopBar';
import LoadingSpinner from '../../products/LoadingSpinner';

// En EditFeaturesProduct.tsx - Actualizar la interfaz
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category_id: number;
  condition: 'new' | 'used' | 'refurbished';
  tags: string[];
  features: Record<string, any>;
  images: string[];
  seller_id: number; // Agregar esta propiedad
}

function EditFeaturesProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const { createProduct, loading } = useProducts();
  const { categories } = useCategories();
  
  const baseProduct = location.state?.baseProduct;
  const similarProduct = location.state?.similarProduct;
  const isSellingExisting = location.state?.isSellingExisting;

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        stock: 1,
        category_id: 0,
        condition: 'new',
        tags: [],
        features: {},
        images: [],
        seller_id: user?.id || 0 // Agregar seller_id
    });

  const [currentFeatureKey, setCurrentFeatureKey] = useState('');
  const [currentFeatureValue, setCurrentFeatureValue] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Inicializar con datos del producto base si existe
  useEffect(() => {
    if (baseProduct || similarProduct) {
      const sourceProduct = baseProduct || similarProduct;
       setFormData({
        name: isSellingExisting ? sourceProduct.name : `${sourceProduct.name} (Mi versión)`,
        description: sourceProduct.description,
        price: sourceProduct.price,
        discount: 0,
        stock: 1,
        category_id: sourceProduct.category_id,
        condition: sourceProduct.condition,
        tags: [...sourceProduct.tags],
        features: { ...sourceProduct.features },
        images: [],
        seller_id: user?.id || 0 // Agregar seller_id
        });
    }
  }, [baseProduct, similarProduct, isSellingExisting, user?.id]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (currentFeatureKey.trim() && currentFeatureValue.trim()) {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [currentFeatureKey.trim()]: currentFeatureValue.trim()
        }
      }));
      setCurrentFeatureKey('');
      setCurrentFeatureValue('');
    }
  };

  const handleRemoveFeature = (key: string) => {
    setFormData(prev => {
      const newFeatures = { ...prev.features };
      delete newFeatures[key];
      return { ...prev, features: newFeatures };
    });
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

    const handleRemoveImage = (imageToRemove: string) => {
            setFormData(prev => ({
            ...prev,
            images: prev.images.filter(image => image !== imageToRemove)
            }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.category_id) {
            alert('Por favor selecciona una categoría');
            return;
        }

        if (!token) { // Corregí esta condición - debe ser !token
            alert('Debes estar autenticado para publicar productos');
            return;
        }

        if (!user?.id) { // Verificar explícitamente que user.id existe
            alert('Error: No se pudo obtener tu información de usuario');
            return;
        }

        // Asegurar que seller_id esté establecido como número
        const finalFormData = {
            ...formData,
            seller_id: user.id // user.id ya está verificado arriba, así que es number
        };

        setIsSubmitting(true);
        try {
            await createProduct(finalFormData, token);
            alert('¡Producto publicado exitosamente!');
            navigate('/');
        } catch (error) {
            console.error('Error al publicar producto:', error);
            alert('Error al publicar el producto. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };


  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {baseProduct || similarProduct ? 'Publicar Producto' : 'Crear Nuevo Producto'}
          </h1>
          <p className="text-gray-600 mb-6">
            Completa la información de tu producto para publicarlo en la plataforma.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: iPhone 13 Pro Max 256GB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe tu producto en detalle..."
              />
            </div>

            {/* Precio y stock */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio ($) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Condición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condición *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['new', 'used', 'refurbished'].map(condition => (
                  <label key={condition} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={condition}
                      checked={formData.condition === condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {condition === 'new' ? 'Nuevo' : 
                       condition === 'used' ? 'Usado' : 
                       'Reacondicionado'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Características */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Características
              </label>
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={currentFeatureKey}
                    onChange={(e) => setCurrentFeatureKey(e.target.value)}
                    placeholder="Ej: Marca"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentFeatureValue}
                      onChange={(e) => setCurrentFeatureValue(e.target.value)}
                      placeholder="Ej: Apple"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Lista de características */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Características agregadas:</h4>
                  {Object.keys(formData.features).length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay características agregadas</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(formData.features).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">
                            <span className="font-medium capitalize">{key}:</span> {String(value)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(key)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Etiquetas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Ej: tecnología, smartphone, apple"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de etiquetas */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes del Producto
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>

              {/* Vista previa de imágenes */}
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Vista previa ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/sell')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditFeaturesProduct;