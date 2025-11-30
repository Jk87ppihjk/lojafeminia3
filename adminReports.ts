import express, { Request, Response } from 'express';
import { verifyAdmin } from './authMiddleware';
import { pool } from './db';

const router = express.Router();

router.get('/analytics', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // Top selling products
    const [topProducts] = await pool.query(`
      SELECT p.name, SUM(oi.quantity) as sold, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY sold DESC
      LIMIT 5
    `);

    // Low stock
    const [lowStock] = await pool.query('SELECT * FROM products WHERE stock < 10');

    res.json({ topProducts, lowStock });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatórios' });
  }
});

export default router;