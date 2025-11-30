import express from 'express';
import { verifyAdmin } from './authMiddleware';
import { pool } from './db';

const router = express.Router();

router.get('/', verifyAdmin, async (req: any, res: any) => {
  try {
    const { search } = req.query;
    let query = 'SELECT id, name, email, created_at FROM users WHERE role = "customer"';
    const params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [customers] = await pool.query(query, params);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

export default router;