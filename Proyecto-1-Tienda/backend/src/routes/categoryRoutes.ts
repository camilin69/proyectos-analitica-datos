import express from 'express';
import { categoryController } from '../controllers/categoryController';

const router = express.Router();

// Rutas para categorías
router.get('/', categoryController.getAllCategories);
router.get('/with-products', categoryController.getCategoriesWithProducts);
router.get('/id/:id', categoryController.getCategoryById);
router.get('/name/:name', categoryController.getCategoryByName);
router.post('/create', categoryController.createCategory);
router.put('/update/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

export default router;