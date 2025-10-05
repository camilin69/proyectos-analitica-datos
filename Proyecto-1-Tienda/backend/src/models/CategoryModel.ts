import { QueryResult } from 'pg';
import pool from './database';

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export class CategoryModel {
  // Obtener todas las categorías
  static async findAll(): Promise<Category[]> {
    const query = `
      SELECT 
        id,
        name,
        description,
        created_at
      FROM categories 
      ORDER BY name ASC
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  // Obtener categoría por ID
  static async findById(id: number): Promise<Category | null> {
    const query = `
      SELECT 
        id,
        name,
        description,
        created_at
      FROM categories 
      WHERE id = $1
    `;
    
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Obtener categoría por nombre
  static async findByName(name: string): Promise<Category | null> {
    const query = `
      SELECT 
        id,
        name,
        description,
        created_at
      FROM categories 
      WHERE name ILIKE $1
    `;
    
    const result: QueryResult = await pool.query(query, [name]);
    return result.rows[0] || null;
  }

  // Obtener categorías con productos
  static async findWithProducts(): Promise<Category[]> {
    const query = `
      SELECT DISTINCT
        c.id,
        c.name,
        c.description,
        c.created_at,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description, c.created_at
      HAVING COUNT(p.id) > 0
      ORDER BY c.name ASC
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  // Crear nueva categoría
  static async create(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const values = [
      categoryData.name,
      categoryData.description
    ];
    
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0];
  }

  // Actualizar categoría
  static async update(id: number, categoryData: Partial<Category>): Promise<Category | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (categoryData.name) {
      fields.push(`name = $${paramCount}`);
      values.push(categoryData.name);
      paramCount++;
    }
    
    if (categoryData.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(categoryData.description);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE categories 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Eliminar categoría
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM categories WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}