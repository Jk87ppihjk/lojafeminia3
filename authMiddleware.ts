import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from './types';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

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