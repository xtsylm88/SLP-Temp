// backend/src/routes/auth.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { setAuthCookie, clearAuthCookie, setStateCookie, clearStateCookie, STATE_COOKIE_NAME, AUTH_COOKIE_NAME } from '../utils/cookie';
import { BadRequestError } from '../utils/errors';

export const authRouter = Router();

/**
 * GET /auth/login
 * Memulai flow Google OAuth
 */
authRouter.get('/login', (req: Request, res: Response) => {
  const { state, url } = authService.initiateOAuthLogin();
  setStateCookie(res, state);
  res.redirect(url);
});

/**
 * GET /auth/callback
 * Menerima callback dari Google OAuth setelah login pengguna
 */
authRouter.get('/callback', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'auth-callback-trace';
  const code = req.query.code as string;
  const state = req.query.state as string;
  const cookieState = req.cookies?.[STATE_COOKIE_NAME];
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  try {
    if (!code) {
      throw new BadRequestError('Authorization code tidak ditemukan dari callback Google.', 'MISSING_OAUTH_CODE', traceId);
    }

    const { token } = await authService.handleOAuthCallback(code, state, cookieState, ip, traceId);

    // Hapus state cookie & simpan JWT di httpOnly Cookie
    clearStateCookie(res);
    setAuthCookie(res, token);

    // Redirect ke Admin Dashboard
    res.redirect('/admin');
  } catch (err) {
    clearStateCookie(res);
    next(err);
  }
});

/**
 * POST /auth/logout
 * Menghapus token autentikasi (Logout)
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({
    success: true,
    message: 'Berhasil keluar dari sistem.',
  });
});

/**
 * GET /auth/me
 * Mengecek status autentikasi pengguna aktif
 */
authRouter.get('/me', (req: Request, res: Response) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'auth-me-trace';
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  const status = authService.getAuthStatus(token, traceId);
  res.json({
    success: true,
    ...status,
  });
});
