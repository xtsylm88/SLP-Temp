// backend/src/middleware/rateLimiter.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requests = new Map<string, RateLimitRecord>();

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = requests.get(ip);

  if (!record || now > record.resetTime) {
    requests.set(ip, {
      count: 1,
      resetTime: now + config.rateLimit.windowMs,
    });
    return next();
  }

  if (record.count >= config.rateLimit.max) {
    return res
      .status(HTTP_STATUS.TOO_MANY_REQUESTS)
      .json(
        createErrorResponse(
          'Terlalu banyak permintaan. Silakan coba beberapa saat lagi.',
          ERROR_CODES.RATE_LIMIT_EXCEEDED
        )
      );
  }

  record.count += 1;
  next();
};
