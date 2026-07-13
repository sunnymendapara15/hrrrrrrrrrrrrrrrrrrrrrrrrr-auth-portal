import { Router } from 'express';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authenticate';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
} from '../models/userStore';
import { validateSignup, validateUserUpdate } from '../utils/validation';
import { HttpError } from '../utils/httpError';

const router = Router();

router.use(authenticateToken);

router.get('/', (_req, res) => {
  res.json({ users: getAllUsers() });
});

router.post('/', async (req, res, next) => {
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
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      throw new HttpError(400, 'Invalid user id');
    }
    const payload = validateUserUpdate(req.body);
    const updatePayload: {
      name?: string;
      email?: string;
      role?: string;
      passwordHash?: string;
    } = {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    if (payload.password) {
      updatePayload.passwordHash = await bcrypt.hash(payload.password, 10);
    }
    const updated = updateUser(id, updatePayload);
    if (!updated) {
      throw new HttpError(404, 'HR user not found');
    }
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      throw new HttpError(400, 'Invalid user id');
    }
    const deleted = deleteUser(id);
    if (!deleted) {
      throw new HttpError(404, 'HR user not found');
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
