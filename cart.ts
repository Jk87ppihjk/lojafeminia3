import express from 'express';
import { pool } from './db';

const router = express.Router();

router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, quantity }
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Carrinho inválido' });

    const validatedItems = [];
    let total = 0;

    for (const item of items) {
      const [rows]: any = await pool.query('SELECT id, name, price, image_url FROM products WHERE id = ?', [item.id]);
      if (rows.length > 0) {
        const product = rows[0];
        validatedItems.push({
          ...product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity
        });
        total += product.price * item.quantity;
      }
    }

    res.json({ items: validatedItems, total });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar carrinho' });
  }
});

export default router;