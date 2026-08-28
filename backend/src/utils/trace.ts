// backend/src/utils/trace.ts
import { Request } from 'express';
import crypto from 'crypto';

/**
 * Generate Trace ID baru dengan format TRC-xxxxxxxxxxxxxxxx
 */
export function generateTraceId(): string {
  const randomHex = crypto.randomBytes(8).toString('hex');
  return `TRC-${randomHex}`;
}

/**
 * Mengambil Trace ID dari header X-Trace-Id atau membuat baru jika tidak ditemukan
 */
export function getOrGenerateTraceId(req?: Request): string {
  if (req) {
    const headerTraceId = req.headers['x-trace-id'];
    if (typeof headerTraceId === 'string' && headerTraceId.trim()) {
      return headerTraceId.trim();
    }
  }
  return generateTraceId();
}
