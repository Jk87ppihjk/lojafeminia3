import express, { Request, Response } from 'express';
import { verifyToken } from './authMiddleware';
import { pool } from './db';
import { AuthenticatedRequest } from './types';

const router = express.Router();

// Process Checkout
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Explicitly cast req to any to access body safely if Typescript complains
    const { items, total, paymentMethod } = (req as any).body;
    const userId = (req as AuthenticatedRequest).user?.id;

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