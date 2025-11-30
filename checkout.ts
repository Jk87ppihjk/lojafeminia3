import express, { Request, Response } from 'express';
import { verifyToken } from './authMiddleware';
import { pool } from './db';

const router = express.Router();

// Process Checkout
router.post('/', verifyToken, async (req: any, res: any) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Fix: Cast req to any to avoid TypeScript error on body property
    const { items, total, paymentMethod } = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0) {
      throw new Error("Carrinho vazio");
    }

    // 1. Create Order
    const [orderResult]: any = await connection.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userId, total, 'pending']
    );
    const orderId = orderResult.insertId;

    // 2. Insert Items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    // 3. Mock Payment Integration (AbacatePay placeholder)
    // You can use process.env.ABACATEPAY_SECRET here in the future
    if (paymentMethod === 'pix') {
      console.log('Processing PIX...');
    } else {
      console.log('Processing Card...');
    }

    await connection.commit();
    res.status(201).json({ message: 'Pedido realizado com sucesso', orderId });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar checkout' });
  } finally {
    connection.release();
  }
});

export default router;