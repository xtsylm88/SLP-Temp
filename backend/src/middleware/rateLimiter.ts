// backend/src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import { envConfig } from '../config/env';

interface ClientRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, ClientRecord>();

/**
 * In-Memory Rate Limiter Middleware
 * Melindungi backend dan Apps Script dari request berlebihan.
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Bypass rate limiting for health check endpoints to prevent background status checks from consuming user quota
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  const ip = req.ip || '127.0.0.1';
  const now = Date.now();

  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + envConfig.rateLimitWindowMs,
    });
    return next();
  }

  record.count += 1;

  if (record.count > envConfig.rateLimitMaxRequests) {
    res.status(429).json({
      success: false,
      code: 'TOO_MANY_REQUESTS',
      message: 'Terlalu banyak permintaan dari IP ini. Silakan coba beberapa saat lagi.',
      traceId: req.traceId,
    });
    return;
  }

  next();
}
