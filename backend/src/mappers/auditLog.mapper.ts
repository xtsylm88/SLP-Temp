// backend/src/mappers/auditLog.mapper.ts
import { AuditLogEntry, PaginatedAuditLog } from '../types/appscript';

export interface AuditLogDTO {
  timestamp: string;
  trace_id: string;
  request_id: string;
  level: string;
  service: string;
  action: string;
  message: string;
  payload: Record<string, unknown> | string;
  actor_email: string;
}

export interface PaginatedAuditLogDTO {
  items: AuditLogDTO[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const SENSITIVE_KEYS = new Set([
  'secret',
  'jwt',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'session',
  'csrf',
  'clientsecret',
]);

/**
  * Melakukan masking defensif terhadap field sensitif pada payload audit log.
  * Apps Script tetap menyimpan payload asli, Express Mapper melakukan masking sebelum dikirim ke client.
  */
export function maskSensitivePayload(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    try {
      const parsed = JSON.parse(obj);
      if (typeof parsed === 'object' && parsed !== null) {
        return maskSensitivePayload(parsed);
      }
    } catch {
      // String biasa
    }
    return obj;
  }

  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitivePayload(item));
  }

  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      result[key] = '********';
    } else {
      result[key] = maskSensitivePayload(obj[key]);
    }
  }
  return result;
}

export function toAuditLogDTO(entry: AuditLogEntry): AuditLogDTO {
  const rawPayload = entry.payload;
  const maskedPayload = maskSensitivePayload(rawPayload);

  return {
    timestamp: entry.timestamp || '',
    trace_id: entry.trace_id || '',
    request_id: entry.request_id || '',
    level: entry.level || 'INFO',
    service: entry.service || '',
    action: entry.action || '',
    message: entry.message || '',
    payload: maskedPayload,
    actor_email: entry.actor_email || '',
  };
}

export function toPaginatedAuditLogDTO(paginated: PaginatedAuditLog): PaginatedAuditLogDTO {
  return {
    items: (paginated.items || []).map(toAuditLogDTO),
    page: paginated.page || 1,
    pageSize: paginated.pageSize || 10,
    total: paginated.total || 0,
    totalPages: paginated.totalPages || 1,
  };
}
