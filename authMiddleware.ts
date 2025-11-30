import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from './types';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Fix: Access headers safely
  const authHeader = req.headers['authorization'];
  const token = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;

  if (!token) return res.status(401).json({ message: 'Acesso negado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as AuthenticatedRequest).user = verified as any;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if ((req as AuthenticatedRequest).user?.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Acesso restrito a administradores' });
    }
  });
};