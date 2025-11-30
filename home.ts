import express from 'express';
import { pool } from './db';

const router = express.Router();

// Get featured products and new arrivals for Home
router.get('/', async (req, res) => {
  try {
    // Fetch 4 newest products
    const [newArrivals] = await pool.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 4');
    // Fetch categories (distinct)
    const [categories] = await pool.query('SELECT DISTINCT category FROM products LIMIT 4');
    
    res.json({ newArrivals, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao carregar home' });
  }
});

export default router;