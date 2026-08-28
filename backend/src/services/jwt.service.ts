// backend/src/services/jwt.service.ts
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env';
import { JwtPayload } from '../types/auth';
import { UnauthorizedError } from '../utils/errors';

export class JwtService {
  private readonly secret: string;
  private readonly expiresIn = '8h'; // 8 Jam

  constructor() {
    this.secret = envConfig.jwtSecret;
  }

  /**
   * Penandatanganan JWT Token dengan payload minimal
   */
  public sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      algorithm: 'HS256',
    });
  }

  /**
   * Verifikasi token JWT dari cookie
   */
  public verify(token: string, traceId?: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: ['HS256'],
      }) as JwtPayload;

      return decoded;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Sesi login telah berakhir, silakan login kembali.', 'TOKEN_EXPIRED', traceId);
      }
      throw new UnauthorizedError('Token autentikasi tidak valid.', 'INVALID_TOKEN', traceId);
    }
  }
}

export const jwtService = new JwtService();
