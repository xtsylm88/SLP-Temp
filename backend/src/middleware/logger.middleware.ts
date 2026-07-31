// backend/src/middleware/logger.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} -> Status: ${statusCode} (${duration}ms)`
    );
  });

  next();
};
