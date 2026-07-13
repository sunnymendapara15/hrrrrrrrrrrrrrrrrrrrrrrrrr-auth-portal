import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = (err as any)?.status || 500;
  const message =
    typeof (err as any)?.message === 'string' ? (err as any).message : 'Internal server error';
  res.status(status).json({ error: message });
};
