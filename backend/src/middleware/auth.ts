// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwt.service';
import { AUTH_COOKIE_NAME } from '../utils/cookie';
import { UnauthorizedError } from '../utils/errors';

/**
 * Express Authentication Middleware.
 * Murni memverifikasi JWT dari httpOnly Cookie tanpa melakukan HTTP request ke Apps Script.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'auth-middleware-trace';

  // 1. Ambil token dari httpOnly Cookie
  let token = req.cookies?.[AUTH_COOKIE_NAME];

  // Fallback: Dukung header Authorization jika ada
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Sesi autentikasi tidak ditemukan. Silakan login terlebih dahulu.', 'UNAUTHENTICATED', traceId);
  }

  // 2. Verifikasi JWT
  const userPayload = jwtService.verify(token, traceId);

  // 3. Attach req.user
  req.user = userPayload;

  next();
}
