import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { generateToken } from '../utils/jwt';
import { validationResult } from 'express-validator';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      console.log('🔍 LOGIN REQUEST BODY:', req.body);
      console.log('🔍 LOGIN REQUEST HEADERS:', req.headers);
      
      const errors = validationResult(req);
      console.log('🔍 VALIDATION ERRORS:', errors.array());
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const isValidPassword = await UserModel.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email
      });

      // No enviar la contraseña en la respuesta
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const { name, email, cedula, phone, password } = req.body;

      // Verificar si el email ya existe
      const emailExists = await UserModel.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Verificar si la cédula ya existe
      const cedulaExists = await UserModel.cedulaExists(cedula);
      if (cedulaExists) {
        return res.status(400).json({
          success: false,
          message: 'La cédula ya está registrada'
        });
      }

      const user = await UserModel.create({
        name,
        email,
        cedula,
        phone,
        password
      });

      const token = generateToken({
        id: user.id,
        email: user.email
      });

      // No enviar la contraseña en la respuesta
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      } 
      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  async verifyToken(req: Request, res: Response) {
    try {
      // El middleware de autenticación ya verificó el token
      // y adjuntó el usuario a req.user
      const user = await UserModel.findById((req as any).user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Error en verificación de token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};