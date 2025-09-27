import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import pool from '../models/database';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
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
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, phone } = req.body;

      const query = `
        UPDATE users 
        SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, name, email, cedula, phone, created_at, updated_at
      `;
      
      const result = await pool.query(query, [name, phone, userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: result.rows[0]
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};