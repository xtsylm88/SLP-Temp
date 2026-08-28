// backend/src/services/auth.service.ts
import { oauthService } from './oauth.service';
import { appscriptService } from './appscript.service';
import { jwtService } from './jwt.service';
import { AuthStatusResponse, JwtPayload } from '../types/auth';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export class AuthService {
  /**
   * Menggenerasi state dan URL redirect ke Google OAuth Login
   */
  public initiateOAuthLogin(): { state: string; url: string } {
    const state = oauthService.generateState();
    const url = oauthService.getAuthUrl(state);
    return { state, url };
  }

  /**
   * Menangani Callback Google OAuth:
   * 1. Verifikasi CSRF State
   * 2. Verifikasi Identity Token dari Google
   * 3. Lookup User Admin di Sheet via Apps Script
   * 4. Update last_login pada Sheet User Admin
   * 5. Sign JWT Token
   */
  public async handleOAuthCallback(
    code: string,
    state: string,
    cookieState: string | undefined,
    ip: string,
    traceId: string
  ): Promise<{ token: string; email: string; name: string; role: string }> {
    // 1. CSRF State Verification
    if (!cookieState || !state || cookieState !== state) {
      throw new UnauthorizedError(
        'Verifikasi OAuth state gagal (kemungkinan serangan CSRF atau timeout).',
        'INVALID_OAUTH_STATE',
        traceId
      );
    }

    // 2. Google Identity Verification
    const googleProfile = await oauthService.verifyGoogleCode(code, traceId);

    // 3. Lookup User Admin
    let adminData;
    try {
      adminData = await appscriptService.findAdminByEmail(googleProfile.email, traceId);
    } catch (err) {
      throw new ForbiddenError(
        `Email '${googleProfile.email}' tidak terdaftar sebagai administrator sistem.`,
        'ADMIN_NOT_FOUND',
        traceId
      );
    }

    if (!adminData || !adminData.aktif) {
      throw new ForbiddenError(
        `Akun admin '${googleProfile.email}' dalam status non-aktif. Akses ditolak.`,
        'ADMIN_INACTIVE',
        traceId
      );
    }

    // 4. Update Last Login (secara asinkronus ke Spreadsheet)
    try {
      await appscriptService.updateLastLogin(
        {
          email: adminData.email,
          last_login: new Date().toISOString(),
          last_login_ip: ip,
          last_login_trace_id: traceId,
        },
        traceId
      );
    } catch (err) {
      // Log kegagalan update last login tanpa membatalkan proses login utama
      console.error(`[${traceId}] Gagal memperbarui last_login di Apps Script:`, err);
    }

    // 5. Sign JWT
    const jwtPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: googleProfile.sub,
      email: adminData.email,
      name: adminData.nama || googleProfile.name,
      role: adminData.role || 'ADMIN',
    };

    const token = jwtService.sign(jwtPayload);

    return {
      token,
      email: adminData.email,
      name: adminData.nama || googleProfile.name,
      role: adminData.role || 'ADMIN',
    };
  }

  /**
   * Mengecek status autentikasi berdasarkan token dari Cookie
   */
  public getAuthStatus(token: string | undefined, traceId: string): AuthStatusResponse {
    if (!token) {
      throw new UnauthorizedError('Pengguna belum terautentikasi.', 'UNAUTHENTICATED', traceId);
    }

    const payload = jwtService.verify(token, traceId);

    return {
      authenticated: true,
      user: {
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    };
  }
}

export const authService = new AuthService();
