import express from 'express';
import { couponController } from '../controllers/couponController';

const router = express.Router();

// Rutas para cupones
router.get('/', couponController.getAllCoupons);
router.get('/categories', couponController.getCategoriesWithCoupons);
router.get('/category/:categoryId', couponController.getCouponsByCategory);
router.get('/code/:code', couponController.getCouponByCode);
router.post('/use/:id', couponController.useCoupon);
router.get('/featured', couponController.getFeaturedCoupons);
router.get('/expiring', couponController.getExpiringCoupons);

export default router;