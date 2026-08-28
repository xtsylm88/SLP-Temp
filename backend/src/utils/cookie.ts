// backend/src/utils/cookie.ts
import { Response } from 'express';
import { envConfig } from '../config/env';

export const AUTH_COOKIE_NAME = 'admin_access_token';
export const STATE_COOKIE_NAME = 'oauth_state';

const isProduction = envConfig.nodeEnv === 'production';

/**
 * Menyimpan JWT ke dalam httpOnly cookie (MaxAge: 8 Jam)
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax', // Lax diperlukan agar cookie terkirim pada navigasi antar halaman
    maxAge: 8 * 60 * 60 * 1000, // 8 jam
    path: '/',
  });
}

/**
 * Menghapus httpOnly auth cookie (Logout)
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Menyimpan temporary state cookie untuk pencegahan CSRF pada OAuth (MaxAge: 10 Menit)
 * WAJIB sameSite = 'lax' (BUKAN 'strict') karena redirect Google adalah navigasi cross-site!
 */
export function setStateCookie(res: Response, state: string): void {
  res.cookie(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 menit
    path: '/',
  });
}

/**
 * Menghapus temporary oauth state cookie
 */
export function clearStateCookie(res: Response): void {
  res.clearCookie(STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
}
