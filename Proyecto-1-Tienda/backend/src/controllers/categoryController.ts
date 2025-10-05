import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';

export const categoryController = {
  // Obtener todas las categorías
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await CategoryModel.findAll();
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener categoría por ID
  getCategoryById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findById(parseInt(id));
      
      if (!category) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoría no encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener categoría por nombre
  getCategoryByName: async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const category = await CategoryModel.findByName(name);
      
      if (!category) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoría no encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category by name:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Obtener categorías con productos
  getCategoriesWithProducts: async (req: Request, res: Response) => {
    try {
      const categories = await CategoryModel.findWithProducts();
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Error fetching categories with products:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Crear nueva categoría
  createCategory: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ 
          success: false,
          error: 'El nombre de la categoría es requerido' 
        });
      }

      const category = await CategoryModel.create({ name, description });
      
      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Actualizar categoría
  updateCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      
      const category = await CategoryModel.update(parseInt(id), categoryData);
      
      if (!category) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoría no encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },

  // Eliminar categoría
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await CategoryModel.delete(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ 
          success: false,
          error: 'Categoría no encontrada' 
        });
      }
      
      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  }
};