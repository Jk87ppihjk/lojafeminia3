import express from 'express';
import { pool } from './db';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do produto' });
  }
});

export default router;