import Database from 'better-sqlite3';
import { DB_PATH } from '../config';
import { HttpError } from '../utils/httpError';

export interface HrUserRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface HrUserPublic {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS hr_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);
db.prepare('CREATE INDEX IF NOT EXISTS idx_hr_users_email ON hr_users(email COLLATE NOCASE)').run();

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizeText = (value: string) => value.trim();

export const sanitizeUser = (row: HrUserRecord): HrUserPublic => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const getUserByEmail = (email: string): HrUserRecord | undefined => {
  return db.prepare('SELECT * FROM hr_users WHERE LOWER(email) = ?').get(normalizeEmail(email));
};

export const getUserById = (id: number): HrUserRecord | undefined => {
  return db.prepare('SELECT * FROM hr_users WHERE id = ?').get(id);
};

export const getAllUsers = (): HrUserPublic[] => {
  return db
    .prepare('SELECT * FROM hr_users ORDER BY created_at DESC')
    .all()
    .map(sanitizeUser);
};

export const createUser = (payload: {
  name: string;
  email: string;
  role: string;
  passwordHash: string;
}): HrUserPublic => {
  const name = normalizeText(payload.name);
  const email = normalizeEmail(payload.email);
  const role = normalizeText(payload.role) || 'hr';

  try {
    const result = db
      .prepare(
        'INSERT INTO hr_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
      )
      .run(name, email, payload.passwordHash, role);
    const record = getUserById(result.lastInsertRowid as number);
    if (!record) {
      throw new HttpError(500, 'Unable to read created user');
    }
    return sanitizeUser(record);
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new HttpError(409, 'Email already exists');
    }
    throw error;
  }
};

export const updateUser = (
  id: number,
  updates: {
    name?: string;
    email?: string;
    role?: string;
    passwordHash?: string;
  }
): HrUserPublic | undefined => {
  const assignments: string[] = [];
  const params: (string | number)[] = [];

  if (typeof updates.name === 'string') {
    const name = normalizeText(updates.name);
    if (name) {
      assignments.push('name = ?');
      params.push(name);
    }
  }

  if (typeof updates.email === 'string') {
    const email = normalizeEmail(updates.email);
    if (email) {
      assignments.push('email = ?');
      params.push(email);
    }
  }

  if (typeof updates.role === 'string') {
    const role = normalizeText(updates.role);
    if (role) {
      assignments.push('role = ?');
      params.push(role);
    }
  }

  if (updates.passwordHash) {
    assignments.push('password_hash = ?');
    params.push(updates.passwordHash);
  }

  if (assignments.length === 0) {
    throw new HttpError(400, 'No updates were provided');
  }

  assignments.push('updated_at = CURRENT_TIMESTAMP');
  const statement = db.prepare(`UPDATE hr_users SET ${assignments.join(', ')} WHERE id = ?`);
  params.push(id);

  try {
    const result = statement.run(...params);
    if (result.changes === 0) {
      return undefined;
    }
    const updated = getUserById(id);
    return updated ? sanitizeUser(updated) : undefined;
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new HttpError(409, 'Email already exists');
    }
    throw error;
  }
};

export const deleteUser = (id: number): boolean => {
  const result = db.prepare('DELETE FROM hr_users WHERE id = ?').run(id);
  return result.changes > 0;
};
