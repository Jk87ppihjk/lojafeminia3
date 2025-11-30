import express, { Request, Response } from 'express';
import { verifyAdmin } from './authMiddleware';
import { pool } from './db';

const router = express.Router();

router.get('/stats', verifyAdmin, async (req: any, res: any) => {
  try {
    // Total Sales
    const [salesRows]: any = await pool.query('SELECT SUM(total) as total FROM orders WHERE status != "cancelled"');
    // Total Orders
    const [ordersRows]: any = await pool.query('SELECT COUNT(*) as count FROM orders');
    // Total Customers
    const [usersRows]: any = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    
    // Recent Orders
    const [recentOrders]: any = await pool.query(`
      SELECT o.id, u.name as customer, o.total, o.status 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC LIMIT 5
    `);

    res.json({
      sales: salesRows[0].total || 0,
      orders: ordersRows[0].count,
      customers: usersRows[0].count,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

export default router;