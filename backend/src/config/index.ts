// backend/src/config/index.ts
import { envConfig } from './env';

export const config = {
  port: envConfig.port,
  nodeEnv: envConfig.nodeEnv,
  appsScript: {
    url: envConfig.appsScriptUrl,
    secret: envConfig.appsScriptSecret,
  },
  cacheTtlMs: envConfig.cacheTtlMs,
  healthCacheTtlMs: envConfig.healthCacheTtlMs,
  timeoutMs: envConfig.timeoutMs,
  rateLimit: {
    windowMs: envConfig.rateLimitWindowMs,
    max: envConfig.rateLimitMaxRequests,
  },
};

export { envConfig };
