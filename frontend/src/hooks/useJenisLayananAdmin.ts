// frontend/src/hooks/useJenisLayananAdmin.ts
import { useState, useEffect, useCallback } from 'react';
import { JenisLayananAdminDTO } from '../types/admin';
import { adminJenisLayananService } from '../services/adminJenisLayanan.service';

export function useJenisLayananAdmin() {
  const [data, setData] = useState<JenisLayananAdminDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminJenisLayananService.getJenisLayananList();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat jenis layanan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const createJenisLayanan = async (payload: {
    id: string;
    nama: string;
    deskripsi?: string;
    schema_version?: number;
    field_schema: any;
    aktif?: boolean;
  }) => {
    const res = await adminJenisLayananService.createJenisLayanan(payload);
    await fetchList();
    return res;
  };

  const updateJenisLayanan = async (
    id: string,
    payload: {
      nama: string;
      deskripsi?: string;
      schema_version?: number;
      field_schema?: any;
      aktif?: boolean;
    }
  ) => {
    const res = await adminJenisLayananService.updateJenisLayanan(id, payload);
    await fetchList();
    return res;
  };

  const deleteJenisLayanan = async (id: string) => {
    const res = await adminJenisLayananService.deleteJenisLayanan(id);
    await fetchList();
    return res;
  };

  return {
    data,
    loading,
    error,
    refetch: fetchList,
    createJenisLayanan,
    updateJenisLayanan,
    deleteJenisLayanan,
  };
}
