import { Router } from 'express';
import { authController } from '../controllers/authController';
import { loginValidation, registerValidation } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);
router.get('/verify', authenticateToken, authController.verifyToken);

export default router;