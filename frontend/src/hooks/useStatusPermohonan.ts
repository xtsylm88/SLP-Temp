// frontend/src/hooks/useStatusPermohonan.ts

import { useState } from 'react';
import { permohonanService, PermohonanPublic } from '../services/permohonan.service';
import { ApiError } from '../services/api';

export function useStatusPermohonan() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<PermohonanPublic | null>(null);

  const checkStatus = async (requestId: string) => {
    if (!requestId.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await permohonanService.getStatusPublic(requestId);
      setData(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError(err instanceof Error ? err.message : 'Gagal mengambil status permohonan', 500));
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { checkStatus, loading, error, data, reset };
}
