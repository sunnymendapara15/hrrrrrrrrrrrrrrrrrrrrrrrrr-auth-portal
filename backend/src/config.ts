import 'dotenv/config';

export const PORT = Number(process.env.PORT) || 4000;
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
export const DB_PATH = process.env.DB_PATH || 'data/hr.sqlite';

if (!process.env.JWT_SECRET) {
  console.warn(
    '[config] JWT_SECRET not set; using fallback value. Set JWT_SECRET in .env for production.'
  );
}
