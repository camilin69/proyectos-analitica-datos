import { QueryResult } from 'pg';
import pool from './database';

export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  seller_id: number;
  stock: number;
  images: string[];
  condition: string;
  tags: string[];
  description: string;
  category_id: number;
  features: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProductWithDetails extends Product {
  seller_name: string;
  seller_rating: number;
  seller_total_sales: number;
  seller_avatar_url?: string;
  seller_is_verified: boolean;
  category_name: string;
}

export class ProductModel {
  // Obtener todos los productos con detalles
  static async findAll(): Promise<ProductWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }

  // Obtener producto por ID
  static async findById(id: number): Promise<ProductWithDetails | null> {
    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Obtener productos por categoría
  static async findByCategory(categoryId: number): Promise<ProductWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.created_at DESC
    `;
    
    const result: QueryResult = await pool.query(query, [categoryId]);
    return result.rows;
  }

  // Obtener productos por vendedor
  static async findBySeller(sellerId: number): Promise<ProductWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.seller_id = $1
      ORDER BY p.created_at DESC
    `;
    
    const result: QueryResult = await pool.query(query, [sellerId]);
    return result.rows;
  }

  // Buscar productos por texto
  static async search(query: string): Promise<ProductWithDetails[]> {
    const searchQuery = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE 
        p.name ILIKE $1 OR 
        p.description ILIKE $1 OR
        c.name ILIKE $1 OR
        EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(p.tags) AS tag
          WHERE tag ILIKE $1
        )
      ORDER BY p.created_at DESC
    `;
    
    const result: QueryResult = await pool.query(searchQuery, [`%${query}%`]);
    return result.rows;
  }

  // Crear nuevo producto
  static async create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const query = `
      INSERT INTO products (
        name, price, discount, seller_id, stock, images, condition, 
        tags, description, category_id, features
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      productData.name,
      productData.price,
      productData.discount,
      productData.seller_id,
      productData.stock,
      JSON.stringify(productData.images),
      productData.condition,
      JSON.stringify(productData.tags),
      productData.description,
      productData.category_id,
      JSON.stringify(productData.features)
    ];
    
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0];
  }

  // Actualizar producto
  static async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Construir dinámicamente la query
    if (productData.name) {
      fields.push(`name = $${paramCount}`);
      values.push(productData.name);
      paramCount++;
    }
    if (productData.price) {
      fields.push(`price = $${paramCount}`);
      values.push(productData.price);
      paramCount++;
    }
    if (productData.discount !== undefined) {
      fields.push(`discount = $${paramCount}`);
      values.push(productData.discount);
      paramCount++;
    }
    if (productData.stock !== undefined) {
      fields.push(`stock = $${paramCount}`);
      values.push(productData.stock);
      paramCount++;
    }
    if (productData.images) {
      fields.push(`images = $${paramCount}`);
      values.push(JSON.stringify(productData.images));
      paramCount++;
    }
    if (productData.condition) {
      fields.push(`condition = $${paramCount}`);
      values.push(productData.condition);
      paramCount++;
    }
    if (productData.tags) {
      fields.push(`tags = $${paramCount}`);
      values.push(JSON.stringify(productData.tags));
      paramCount++;
    }
    if (productData.description) {
      fields.push(`description = $${paramCount}`);
      values.push(productData.description);
      paramCount++;
    }
    if (productData.category_id) {
      fields.push(`category_id = $${paramCount}`);
      values.push(productData.category_id);
      paramCount++;
    }
    if (productData.features) {
      fields.push(`features = $${paramCount}`);
      values.push(JSON.stringify(productData.features));
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Eliminar producto
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Obtener productos destacados (con descuento o más vendidos)
  static async getFeatured(): Promise<ProductWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.discount > 0 OR p.stock > 0
      ORDER BY p.discount DESC, p.created_at DESC
      LIMIT 10
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows;
  }
}