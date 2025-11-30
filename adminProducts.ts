import express, { Request, Response } from 'express';
import { verifyAdmin } from './authMiddleware';
import { pool } from './db';

const router = express.Router();

// List all (admin view)
router.get('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

// Create
router.post('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, price, sku, stock, category, image_url } = req.body;
    await pool.query(
      'INSERT INTO products (name, description, price, sku, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, sku, stock, category, image_url]
    );
    res.status(201).json({ message: 'Produto criado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Delete
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Produto removido' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

export default router;