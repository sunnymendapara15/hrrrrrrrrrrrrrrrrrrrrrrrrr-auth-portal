import { HttpError } from './httpError';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizeText = (value: string) => value.trim();

const requireField = (name: string, value: any) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${name} is required`);
  }
  return normalizeText(value);
};

export function validateSignup(payload: any): {
  name: string;
  email: string;
  password: string;
  role: string;
} {
  if (!payload || typeof payload !== 'object') {
    throw new HttpError(400, 'Invalid payload');
  }
  const name = requireField('Name', payload.name);
  const email = normalizeEmail(requireField('Email', payload.email));
  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Email must be valid');
  }
  const password = typeof payload.password === 'string' ? payload.password : '';
  if (password.length < 8) {
    throw new HttpError(400, 'Password must be at least 8 characters');
  }
  const role =
    typeof payload.role === 'string' && payload.role.trim()
      ? normalizeText(payload.role)
      : 'hr';
  return { name, email, password, role };
}

export function validateLogin(payload: any): { email: string; password: string } {
  if (!payload || typeof payload !== 'object') {
    throw new HttpError(400, 'Invalid payload');
  }
  const email = normalizeEmail(requireField('Email', payload.email));
  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Email must be valid');
  }
  const password = typeof payload.password === 'string' ? payload.password : '';
  if (!password) {
    throw new HttpError(400, 'Password is required');
  }
  return { email, password };
}

export function validateUserUpdate(payload: any): {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
} {
  if (!payload || typeof payload !== 'object') {
    throw new HttpError(400, 'Invalid payload');
  }
  const updates: {
    name?: string;
    email?: string;
    role?: string;
    password?: string;
  } = {};
  if (typeof payload.name === 'string' && payload.name.trim()) {
    updates.name = normalizeText(payload.name);
  }
  if (typeof payload.email === 'string' && payload.email.trim()) {
    const email = normalizeEmail(payload.email);
    if (!emailRegex.test(email)) {
      throw new HttpError(400, 'Email must be valid');
    }
    updates.email = email;
  }
  if (typeof payload.role === 'string' && payload.role.trim()) {
    updates.role = normalizeText(payload.role);
  }
  if (typeof payload.password === 'string' && payload.password.length > 0) {
    if (payload.password.length < 8) {
      throw new HttpError(400, 'Password must be at least 8 characters');
    }
    updates.password = payload.password;
  }
  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, 'At least one field must be provided');
  }
  return updates;
}
