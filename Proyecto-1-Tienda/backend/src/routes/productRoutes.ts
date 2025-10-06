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
router.get('/product/:id', ProductController.getProductById);
router.post('/product/create', ProductController.createProduct);
router.put('/product/update/:id', ProductController.updateProduct);
router.delete('/product/delete/:id', ProductController.deleteProduct);

export default router;