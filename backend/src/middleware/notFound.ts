// backend/src/middleware/notFound.ts
import { Request, Response } from 'express';
import { getOrGenerateTraceId } from '../utils/trace';

/**
 * 404 Not Found Handler Middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  const traceId = req.traceId || getOrGenerateTraceId(req);

  res.status(404).json({
    success: false,
    code: 'ROUTE_NOT_FOUND',
    message: `Endpoint '${req.method} ${req.originalUrl}' tidak ditemukan.`,
    traceId,
  });
}
