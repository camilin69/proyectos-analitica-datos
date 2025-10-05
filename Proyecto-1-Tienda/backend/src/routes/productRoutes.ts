// routes/products.ts - Agregar esta ruta
import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

// Rutas existentes...
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/search', ProductController.searchProducts);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/category/:categoryId/sellers', ProductController.getSellersByCategory);
router.get('/seller/:sellerId', ProductController.getProductsBySeller);
router.get('/offers', ProductController.getProductsOnOffer);
router.get('/:id', ProductController.getProductById);
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;