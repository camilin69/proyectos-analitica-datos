import express from 'express';
import { ProductController } from '../controllers/productController';
import { 
  validateCreateProduct, 
  validateProductId, 
  validateUpdateProduct 
} from '../middleware/productValidation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/search', ProductController.searchProducts);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/seller/:sellerId', ProductController.getProductsBySeller);
router.get('/:id', validateProductId, ProductController.getProductById);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, validateCreateProduct, ProductController.createProduct);
router.put('/:id', authenticateToken, validateProductId, validateUpdateProduct, ProductController.updateProduct);
router.delete('/:id', authenticateToken, validateProductId, ProductController.deleteProduct);

export default router;