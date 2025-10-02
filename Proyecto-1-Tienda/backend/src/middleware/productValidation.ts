import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param } from 'express-validator';

export const validateCreateProduct = [
  body('name')
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('discount')
    .isFloat({ min: 0, max: 100 })
    .withMessage('El descuento debe estar entre 0 y 100'),
  
  body('seller_id')
    .isInt({ min: 1 })
    .withMessage('El ID del vendedor es requerido'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número positivo'),
  
  body('images')
    .isArray()
    .withMessage('Las imágenes deben ser un array'),
  
  body('condition')
    .isString()
    .isIn(['new', 'used', 'refurbished'])
    .withMessage('La condición debe ser: new, used o refurbished'),
  
  body('tags')
    .isArray()
    .withMessage('Los tags deben ser un array'),
  
  body('description')
    .isString()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('El ID de categoría es requerido'),
  
  body('features')
    .isObject()
    .withMessage('Las características deben ser un objeto'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateProductId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número válido'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateUpdateProduct = [
  body('name')
    .optional()
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El descuento debe estar entre 0 y 100'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número positivo'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }
    next();
  }
];