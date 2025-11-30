import express from 'express';
import { pool } from './db';

const router = express.Router();

// Get featured products and new arrivals for Home
router.get('/', async (req, res) => {
  try {
    // Busca os 4 produtos mais recentes (Ordenado por ID DESC para garantir compatibilidade)
    const [newArrivals] = await pool.query('SELECT * FROM products ORDER BY id DESC LIMIT 4');
    // Busca categorias distintas
    const [categories] = await pool.query('SELECT DISTINCT category FROM products LIMIT 4');
    
    res.json({ newArrivals, categories });
  } catch (error) {
    console.error("Erro na home:", error);
    // Retorna array vazio em caso de erro para não quebrar o frontend
    res.json({ newArrivals: [], categories: [] });
  }
});

export default router;