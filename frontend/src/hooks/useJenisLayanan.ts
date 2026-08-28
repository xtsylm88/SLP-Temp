// frontend/src/hooks/useJenisLayanan.ts

import { useState, useEffect, useCallback } from 'react';
import { jenisLayananService, JenisLayanan } from '../services/jenisLayanan.service';
import { ApiError } from '../services/api';

export function useJenisLayanan() {
  const [data, setData] = useState<JenisLayanan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchLayanan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await jenisLayananService.getAll();
      setData(list);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError(err instanceof Error ? err.message : 'Gagal memuat jenis layanan', 500));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLayanan();
  }, [fetchLayanan]);

  return { data, loading, error, retry: fetchLayanan };
}
