// frontend/src/services/jenisLayanan.service.ts

import { apiFetch } from './api';

export interface FieldSchemaItem {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'file';
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface JenisLayanan {
  id: string;
  nama: string;
  deskripsi: string;
  schema_version: number;
  field_schema: FieldSchemaItem[];
  aktif: boolean;
  created_at?: string;
  updated_at?: string;
}

export const jenisLayananService = {
  /**
   * Mengambil semua daftar Jenis Layanan aktif
   */
  async getAll(): Promise<JenisLayanan[]> {
    const res = await apiFetch<JenisLayanan[]>('/jenis-layanan');
    return res.data || [];
  },

  /**
   * Mengambil detail Jenis Layanan berdasarkan ID
   */
  async getById(id: string): Promise<JenisLayanan> {
    const res = await apiFetch<JenisLayanan>(`/jenis-layanan/${id}`);
    if (!res.data) {
      throw new Error(`Jenis layanan dengan ID ${id} tidak ditemukan`);
    }
    return res.data;
  },
};
