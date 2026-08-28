// frontend/src/hooks/useAuditLog.ts
import { useState, useEffect, useCallback } from 'react';
import { AuditLogFilterParams, PaginatedAuditLogDTO } from '../types/admin';
import { auditLogService } from '../services/auditLog.service';

export function useAuditLog(initialParams: AuditLogFilterParams = {}) {
  const [params, setParams] = useState<AuditLogFilterParams>({
    page: 1,
    pageSize: 10,
    search: '',
    level: '',
    service: '',
    actorEmail: '',
    startDate: '',
    endDate: '',
    sortBy: 'timestamp',
    sortOrder: 'desc',
    ...initialParams,
  });

  const [data, setData] = useState<PaginatedAuditLogDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditLogService.getAuditLogList(params);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data audit log.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const setFilters = (newFilters: Partial<AuditLogFilterParams>) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setSorting = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setParams((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  return {
    params,
    data,
    loading,
    error,
    refetch: fetchList,
    setPage,
    setPageSize,
    setFilters,
    setSorting,
  };
}
