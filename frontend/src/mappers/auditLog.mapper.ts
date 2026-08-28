// frontend/src/mappers/auditLog.mapper.ts
import { AuditLogDTO, PaginatedAuditLogDTO, TraceTimelineDTO } from '../types/admin';

export function mapAuditLogItem(data: any): AuditLogDTO {
  return {
    timestamp: data.timestamp || '',
    trace_id: data.trace_id || '',
    request_id: data.request_id || '',
    level: data.level || 'INFO',
    service: data.service || '',
    action: data.action || '',
    message: data.message || '',
    payload: data.payload || {},
    actor_email: data.actor_email || '',
  };
}

export function mapPaginatedAuditLog(data: any): PaginatedAuditLogDTO {
  return {
    items: (data.items || []).map(mapAuditLogItem),
    page: data.page || 1,
    pageSize: data.pageSize || 10,
    total: data.total || 0,
    totalPages: data.totalPages || 1,
  };
}

export function mapTraceTimeline(data: any): TraceTimelineDTO {
  return {
    traceId: data.traceId || '',
    entries: (data.entries || []).map(mapAuditLogItem),
  };
}
