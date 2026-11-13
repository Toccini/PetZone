import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export type Role = 'CLIENT' | 'ADMIN';
export interface JwtPayload { id: number; role: Role }

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token ausente' });
  }
  try {
    (req as any).user = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as JwtPayload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export const requireRole = (role: Role) =>
  (req: Request, res: Response, next: NextFunction) =>
    (req as any).user?.role === role
      ? next()
      : res.status(403).json({ message: 'Acesso negado' });