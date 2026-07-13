import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, sanitizeUser } from '../models/userStore';
import { validateLogin, validateSignup } from '../utils/validation';
import { JWT_SECRET } from '../config';
import { HttpError } from '../utils/httpError';

const router = Router();

const signToken = (id: number, email: string) =>
  jwt.sign({ userId: id, email }, JWT_SECRET, { expiresIn: '4h' });

router.post('/signup', async (req, res, next) => {
  try {
    const payload = validateSignup(req.body);
    const existing = getUserByEmail(payload.email);
    if (existing) {
      throw new HttpError(409, 'Email already in use');
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = createUser({
      name: payload.name,
      email: payload.email,
      role: payload.role,
      passwordHash,
    });
    res.status(201).json({
      token: signToken(user.id, user.email),
      user,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const payload = validateLogin(req.body);
    const existing = getUserByEmail(payload.email);
    if (!existing) {
      throw new HttpError(401, 'Invalid credentials');
    }
    const matched = await bcrypt.compare(payload.password, existing.password_hash);
    if (!matched) {
      throw new HttpError(401, 'Invalid credentials');
    }
    res.json({
      token: signToken(existing.id, existing.email),
      user: sanitizeUser(existing),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
