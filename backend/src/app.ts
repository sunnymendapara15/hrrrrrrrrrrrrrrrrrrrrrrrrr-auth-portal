import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import hrUserRoutes from './routes/hrUsers';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/hr/users', hrUserRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
