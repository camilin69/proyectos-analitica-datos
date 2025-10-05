import { QueryResult } from 'pg';
import pool from './database';

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  category_id: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export class CouponModel {
  // Obtener todos los cupones activos
  static async findAllActive(): Promise<Coupon[]> {
    const query = `
      SELECT 
        *
      FROM coupons c
      WHERE c.is_active = true 
      AND (c.usage_limit IS NULL OR c.used_count < c.usage_limit)
      ORDER BY c.discount_value DESC
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  // Obtener cupones por categoría
  static async findByCategory(categoryId: number): Promise<Coupon[]> {
    const query = `
      SELECT 
        c.*
      FROM coupons c
      WHERE c.is_active = true 
        AND (c.category_id = $1)
        AND (c.usage_limit IS NULL OR c.used_count < c.usage_limit)
      ORDER BY c.discount_value DESC
    `;
    
    const result: QueryResult = await pool.query(query, [categoryId]);
    return result.rows;
  }

  // Obtener cupón por código
  static async findByCode(code: string): Promise<Coupon | null> {
    const query = `
      SELECT 
        c.*,
        cat.name as category_name
      FROM coupons c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.code = $1 
        AND c.is_active = true 
        AND c.start_date <= CURRENT_TIMESTAMP 
        AND c.end_date >= CURRENT_TIMESTAMP
        AND (c.usage_limit IS NULL OR c.used_count < c.usage_limit)
    `;
    
    const result: QueryResult = await pool.query(query, [code]);
    return result.rows[0] || null;
  }

  // Incrementar contador de uso
  static async incrementUsage(id: number): Promise<boolean> {
    const query = `
      UPDATE coupons 
      SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND (usage_limit IS NULL OR used_count < usage_limit)
    `;
    
    const result: QueryResult = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Obtener categorías que tienen cupones
  static async getCategoriesWithCoupons(): Promise<any[]> {
    const query = `
      SELECT DISTINCT 
        *
      FROM categories c
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
}