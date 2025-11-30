import express from 'express';
import { pool } from './db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'Todos') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else query += ' ORDER BY id DESC'; // Fallback to ID DESC instead of created_at

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

export default router;