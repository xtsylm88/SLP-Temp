// backend/src/config/env.ts
import dotenv from 'dotenv';
dotenv.config();

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  appsScriptUrl: string;
  appsScriptSecret: string;
  cacheTtlMs: number;
  healthCacheTtlMs: number;
  timeoutMs: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  jwtSecret: string;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
}

export const envConfig: EnvironmentConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appsScriptUrl: process.env.APPS_SCRIPT_URL || '',
  appsScriptSecret: process.env.APPS_SCRIPT_SECRET || '',
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS || '300000', 10), // 5 menit default
  healthCacheTtlMs: 45000, // 45 detik default (30-60 detik)
  timeoutMs: 15000, // 15 detik minimum timeout untuk Apps Script
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 menit
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // Max 1000 request per IP per 15 menit
  jwtSecret: process.env.JWT_SECRET || 'fallback-dev-jwt-secret-do-not-use-in-prod',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/callback',
};
