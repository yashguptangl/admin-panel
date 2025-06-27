// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
interface AuthenticatedRequest extends Request {
    user?: { userId: any; role: string };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) :void => {
  const token = req.headers.token as string;
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' , err });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user?.role || '')) {
      res.status(403).json({ message: 'Unauthorized' });
    } else {
      next();
    }
  };
};