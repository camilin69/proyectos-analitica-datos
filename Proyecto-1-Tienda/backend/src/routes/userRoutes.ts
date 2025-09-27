import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/profile', userController.getProfile);

router.put('/profile', [
  body('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('phone')
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isNumeric()
    .withMessage('El teléfono debe contener solo números')
], userController.updateProfile);

export default router;