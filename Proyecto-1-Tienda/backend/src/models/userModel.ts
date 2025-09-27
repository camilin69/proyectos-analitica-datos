// backend/src/models/userModel.ts (actualizado)
import pool from './database';
import { hashPassword, comparePassword } from '../utils/bcrypt'; // ← Cambiar aquí

export interface User {
  id: number;
  name: string;
  email: string;
  cedula: string;
  phone: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const hashedPassword = await hashPassword(userData.password); // ← Cambiar aquí
    
    const query = `
      INSERT INTO users (name, email, cedula, phone, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, cedula, phone, created_at, updated_at
    `;
    
    const values = [userData.name, userData.email, userData.cedula, userData.phone, hashedPassword];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT id, name, email, cedula, phone, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await comparePassword(plainPassword, hashedPassword); // ← Cambiar aquí
  }

  static async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await pool.query(query, [email]);
    return result.rows[0].exists;
  }

  static async cedulaExists(cedula: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE cedula = $1)';
    const result = await pool.query(query, [cedula]);
    return result.rows[0].exists;
  }
}