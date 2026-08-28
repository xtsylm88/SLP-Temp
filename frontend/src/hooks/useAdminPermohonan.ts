// frontend/src/hooks/useAdminPermohonan.ts
import { useState, useEffect, useCallback } from 'react';
import {
  PaginatedPermohonanAdminDTO,
  PermohonanFilterParams,
  UpdateStatusPayload,
} from '../types/admin';
import { adminPermohonanService } from '../services/adminPermohonan.service';

export function useAdminPermohonan(initialParams: PermohonanFilterParams = {}) {
  const [params, setParams] = useState<PermohonanFilterParams>({
    page: 1,
    pageSize: 10,
    search: '',
    status: '',
    jenisLayananId: '',
    startDate: '',
    endDate: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialParams,
  });

  const [data, setData] = useState<PaginatedPermohonanAdminDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminPermohonanService.getPermohonanList(params);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.');
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

  const setFilters = (newFilters: Partial<PermohonanFilterParams>) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setSorting = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setParams((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const updateStatus = async (requestId: string, payload: UpdateStatusPayload) => {
    const res = await adminPermohonanService.updateStatus(requestId, payload);
    // Refresh list from backend source of truth
    await fetchList();
    return res;
  };

  const softDelete = async (requestId: string) => {
    const res = await adminPermohonanService.softDelete(requestId);
    // Refresh list from backend source of truth
    await fetchList();
    return res;
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
    updateStatus,
    softDelete,
  };
}
