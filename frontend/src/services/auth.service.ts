// frontend/src/services/auth.service.ts

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export interface AuthStatusResponse {
  success: boolean;
  authenticated: boolean;
  user?: AuthUser;
  message?: string;
}

export class AuthService {
  /**
   * Mengarahkan browser ke endpoint Google OAuth Express
   */
  public login(): void {
    window.location.href = '/auth/login';
  }

  /**
   * Mengirim request logout ke Express untuk menghapus httpOnly cookie
   */
  public async logout(): Promise<void> {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal melakukan logout dari server.');
    }
  }

  /**
   * Memeriksa status login saat ini dari Express
   */
  public async me(): Promise<AuthStatusResponse> {
    try {
      const response = await fetch('/auth/me', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          authenticated: false,
        };
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return {
        success: false,
        authenticated: false,
      };
    }
  }
}

export const authService = new AuthService();
