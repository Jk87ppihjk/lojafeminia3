import express from 'express';
import { verifyAdmin } from './authMiddleware';
import { pool } from './db';

const router = express.Router();

// List all (admin view)
router.get('/', verifyAdmin, async (req: any, res: any) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

export default router;