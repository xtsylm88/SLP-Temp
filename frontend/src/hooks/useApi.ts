// frontend/src/hooks/useApi.ts

import { useState, useCallback } from 'react';
import { ApiResponse } from '../../../shared/types';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall();
        if (response.success && response.data !== undefined) {
          setData(response.data);
        } else {
          setError(response.message || 'Terjadi kesalahan');
        }
        return response;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Kesalahan koneksi';
        setError(msg);
        return {
          success: false,
          message: msg,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, execute, setData };
}
