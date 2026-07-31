// backend/src/config/index.ts

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  appsScript: {
    url: process.env.APPS_SCRIPT_URL || '',
    secret: process.env.APPS_SCRIPT_SECRET || '',
  },
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  cacheTtlMs: 5 * 60 * 1000, // 5 menit
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // max 100 request per windowMs
  },
};
