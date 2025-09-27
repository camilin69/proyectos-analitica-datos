import { body } from 'express-validator';

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('cedula')
    .notEmpty()
    .withMessage('La cédula es obligatoria')
    .isNumeric()
    .withMessage('La cédula debe contener solo números')
    .isLength({ min: 6, max: 20 })
    .withMessage('La cédula debe tener entre 6 y 20 caracteres'),
  body('phone')
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isNumeric()
    .withMessage('El teléfono debe contener solo números')
    .isLength({ min: 10, max: 15 })
    .withMessage('El teléfono debe tener entre 10 y 15 caracteres'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];