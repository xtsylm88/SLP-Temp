// frontend/src/services/auditLog.service.ts
import { AuditLogFilterParams, PaginatedAuditLogDTO, TraceTimelineDTO } from '../types/admin';
import { mapPaginatedAuditLog, mapTraceTimeline } from '../mappers/auditLog.mapper';

export const auditLogService = {
  async getAuditLogList(params: AuditLogFilterParams): Promise<PaginatedAuditLogDTO> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.level) queryParams.set('level', params.level);
    if (params.service) queryParams.set('service', params.service);
    if (params.actorEmail) queryParams.set('actorEmail', params.actorEmail);
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const res = await fetch(`/admin/audit-log?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal mengambil daftar audit log.');
    }

    const body = await res.json();
    return mapPaginatedAuditLog(body.data);
  },

  async getAuditTrace(traceId: string): Promise<TraceTimelineDTO> {
    const res = await fetch(`/admin/audit-log/${encodeURIComponent(traceId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Trace ID '${traceId}' tidak ditemukan atau gagal diambil.`);
    }

    const body = await res.json();
    return mapTraceTimeline(body);
  },
};
