// backend/src/middleware/logger.ts
import { Request, Response, NextFunction } from 'express';
import { getOrGenerateTraceId } from '../utils/trace';

// Extend Express Request type untuk menyimpan traceId
declare global {
  namespace Express {
    interface Request {
      traceId?: string;
    }
  }
}

/**
 * Middleware Logger Observability
 * Mencatat method, url, status, durasi eksekusi, dan traceId.
 * Dilarang mencatat secret, header otorisasi, atau data sensitif.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const traceId = getOrGenerateTraceId(req);
  req.traceId = traceId;

  // Set response header agar client/browser dapat melihat traceId
  res.setHeader('X-Trace-Id', traceId);

  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] [${traceId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  next();
}
