import { Request, Response } from 'express';
import { CouponModel } from '../models/CouponModel';

export const couponController = {
  // Obtener todos los cupones activos
  getAllCoupons: async (req: Request, res: Response) => {
    try {
      const coupons = await CouponModel.findAllActive();
      res.json({
        success: true,
        data: coupons,
        count: coupons.length
      });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener cupones por categoría
  getCouponsByCategory: async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const coupons = await CouponModel.findByCategory(parseInt(categoryId));
      res.json({
        success: true,
        data: coupons,
        count: coupons.length
      });
    } catch (error) {
      console.error('Error fetching coupons by category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener cupón por código
  getCouponByCode: async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const coupon = await CouponModel.findByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ 
          success: false,
          error: 'Cupón no encontrado o no válido' 
        });
      }
      
      res.json({
        success: true,
        data: coupon
      });
    } catch (error) {
      console.error('Error fetching coupon by code:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener categorías con cupones
  getCategoriesWithCoupons: async (req: Request, res: Response) => {
    try {
      const categories = await CouponModel.getCategoriesWithCoupons();
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Error fetching categories with coupons:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Usar cupón
  useCoupon: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await CouponModel.incrementUsage(parseInt(id));
      
      if (!success) {
        return res.status(400).json({ 
          success: false,
          error: 'No se pudo usar el cupón' 
        });
      }
      
      res.json({ 
        success: true,
        message: 'Cupón usado exitosamente' 
      });
    } catch (error) {
      console.error('Error using coupon:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener cupones destacados
  getFeaturedCoupons: async (req: Request, res: Response) => {
    try {
      const { limit = 6 } = req.query;
      const coupons = await CouponModel.findAllActive();
      
      // Ordenar por valor de descuento (mayor primero) y limitar
      const featured = coupons
        .sort((a, b) => {
          // Priorizar porcentajes sobre valores fijos
          if (a.discount_type === 'percentage' && b.discount_type !== 'percentage') return -1;
          if (a.discount_type !== 'percentage' && b.discount_type === 'percentage') return 1;
          
          // Ordenar por valor de descuento
          return b.discount_value - a.discount_value;
        })
        .slice(0, parseInt(limit as string));
      
      res.json({
        success: true,
        data: featured,
        count: featured.length
      });
    } catch (error) {
      console.error('Error fetching featured coupons:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener cupones próximos a expirar
  getExpiringCoupons: async (req: Request, res: Response) => {
    try {
      const { days = 7 } = req.query;
      const coupons = await CouponModel.findAllActive();
      
      const now = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(now.getDate() + parseInt(days as string));
      
      const expiring = coupons.filter(coupon => {
        const endDate = new Date(coupon.end_date);
        return endDate <= expirationDate && endDate >= now;
      }).sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
      
      res.json({
        success: true,
        data: expiring,
        count: expiring.length
      });
    } catch (error) {
      console.error('Error fetching expiring coupons:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  }
};