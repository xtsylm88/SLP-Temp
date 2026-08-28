// backend/src/services/oauth.service.ts
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { envConfig } from '../config/env';
import { GoogleUserProfile } from '../types/auth';
import { UnauthorizedError, InternalServerError } from '../utils/errors';

export class OAuthService {
  private getOAuthClient(): OAuth2Client {
    if (!envConfig.googleClientId || !envConfig.googleClientSecret) {
      throw new InternalServerError(
        'Konfigurasi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET belum diset di environment variables.',
        'MISSING_OAUTH_CONFIG'
      );
    }
    return new OAuth2Client(
      envConfig.googleClientId,
      envConfig.googleClientSecret,
      envConfig.googleCallbackUrl
    );
  }

  /**
   * Membuat cryptographically secure random state string
   */
  public generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Menggenerasi Auth URL untuk redirect ke Google OAuth consent screen
   */
  public getAuthUrl(state: string): string {
    const client = this.getOAuthClient();
    return client.generateAuthUrl({
      access_type: 'online',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ],
      state,
      prompt: 'select_account',
    });
  }

  /**
   * Mempertukarkan authorization code dengan ID token dan memverifikasi identitas Google
   */
  public async verifyGoogleCode(code: string, traceId: string): Promise<GoogleUserProfile> {
    const client = this.getOAuthClient();
    try {
      const { tokens } = await client.getToken(code);
      if (!tokens.id_token) {
        throw new UnauthorizedError('Gagal memperoleh ID token dari Google.', 'MISSING_ID_TOKEN', traceId);
      }

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: envConfig.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedError('Gagal mengambil data profil email dari Google OAuth.', 'INVALID_GOOGLE_PROFILE', traceId);
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture,
      };
    } catch (err) {
      if (err instanceof UnauthorizedError) throw err;
      throw new UnauthorizedError(
        `Verifikasi Google OAuth gagal: ${err instanceof Error ? err.message : String(err)}`,
        'OAUTH_VERIFICATION_FAILED',
        traceId
      );
    }
  }
}

export const oauthService = new OAuthService();
