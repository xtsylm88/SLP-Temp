// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { getOrGenerateTraceId } from '../utils/trace';

/**
 * Global Express Error Handler Middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const traceId = req.traceId || (err instanceof AppError && err.traceId) || getOrGenerateTraceId(req);
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred on Express server';

  if (statusCode >= 500) {
    console.error(`[ERROR] [${traceId}] ${code}: ${message}`, err.stack);
  } else {
    console.warn(`[WARN] [${traceId}] ${code}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    code,
    message,
    traceId,
  });
}
