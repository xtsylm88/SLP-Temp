// backend/src/types/auth.ts

export interface JwtPayload {
  sub: string;      // User Google ID
  email: string;    // Admin Email
  name: string;     // Display Name
  role: string;     // ADMIN / SUPER_ADMIN etc.
  iat?: number;     // Issued At
  exp?: number;     // Expiration Time
}

export interface UserAdmin {
  email: string;
  nama: string;
  role: string;
  aktif: boolean;
  last_login?: string;
  last_login_ip?: string;
  last_login_trace_id?: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user?: {
    email: string;
    name: string;
    role: string;
  };
}

export interface GoogleUserProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

// Express Request Extension
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
