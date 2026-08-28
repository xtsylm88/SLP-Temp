// frontend/src/hooks/useTraceTimeline.ts
import { useState, useEffect, useCallback } from 'react';
import { TraceTimelineDTO } from '../types/admin';
import { auditLogService } from '../services/auditLog.service';

export function useTraceTimeline(traceId?: string) {
  const [data, setData] = useState<TraceTimelineDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrace = useCallback(async () => {
    if (!traceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await auditLogService.getAuditTrace(traceId);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat trace timeline.');
    } finally {
      setLoading(false);
    }
  }, [traceId]);

  useEffect(() => {
    fetchTrace();
  }, [fetchTrace]);

  return {
    data,
    loading,
    error,
    refetch: fetchTrace,
  };
}
