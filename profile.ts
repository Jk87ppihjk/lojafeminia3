import express, { Request, Response } from 'express';
import { verifyToken } from './authMiddleware';
import { pool } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) return res.status(400).json({ message: 'Usuário não encontrado' });
    
    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    
    if (!validPass) return res.status(400).json({ message: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

// Register
router.post('/register', async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    const [existing]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) return res.status(400).json({ message: 'Email já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'customer']);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no cadastro' });
  }
});

// Get Profile Data
router.get('/me', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    // Removed created_at from select to be safe if column is missing
    const [users]: any = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    // Ordered by id DESC instead of created_at
    const [orders]: any = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
    
    res.json({ user: users[0], orders });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar perfil' });
  }
});

export default router;