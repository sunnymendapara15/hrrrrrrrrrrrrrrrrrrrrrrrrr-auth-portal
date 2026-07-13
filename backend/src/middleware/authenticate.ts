import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { HttpError } from '../utils/httpError';

export interface AuthenticatedRequest extends Request {
  userId?: number;
  email?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Authorization header missing or malformed'));
  }
  const token = header.split(' ')[1];
  if (!token) {
    return next(new HttpError(401, 'Token missing'));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.userId = payload.userId;
    req.email = payload.email;
    next();
  } catch (err) {
    next(new HttpError(401, 'Invalid or expired token'));
  }
};
