// frontend/src/services/permohonan.service.ts

import { apiFetch } from './api';

export interface PermohonanFormData {
  nama: string;
  jabatan?: string;
  nip?: string;
  instansi?: string;
  wilayah?: string;
  kontak?: string;
  email: string;
  jenis_layanan_id: string;
  schema_version?: number;
  formValues: Record<string, unknown>; // Data dinamis dari Step 2
}

export interface SubmitResult {
  request_id: string;
  status: string;
  created_at: string;
}

export interface PermohonanPublic {
  request_id: string;
  created_at: string;
  jenis_layanan: string;
  status: string;
}

export const permohonanService = {
  /**
   * Mengirim permohonan pendampingan baru.
   * Melakukan mapping formValues -> detail_json sesuai kontrak immutable backend.
   */
  async submit(data: PermohonanFormData): Promise<SubmitResult> {
    const payload = {
      nama: data.nama,
      jabatan: data.jabatan || '',
      nip: data.nip || '',
      instansi: data.instansi || '',
      wilayah: data.wilayah || '',
      kontak: data.kontak || '',
      email: data.email,
      jenis_layanan_id: data.jenis_layanan_id,
      schema_version: data.schema_version || 1,
      detail_json: data.formValues, // MAPPING ABSTRAKSI: formValues menjadi detail_json
    };

    const res = await apiFetch<SubmitResult>('/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!res.data) {
      throw new Error('Gagal memproses permohonan pendampingan.');
    }

    return res.data;
  },

  /**
   * Mengecek status permohonan publik berdasarkan Request ID
   */
  async getStatusPublic(requestId: string): Promise<PermohonanPublic> {
    const cleanId = requestId.trim().toUpperCase();
    const res = await apiFetch<PermohonanPublic>(`/permohonan/status/${encodeURIComponent(cleanId)}`);

    if (!res.data) {
      throw new Error('Data permohonan tidak ditemukan.');
    }

    return res.data;
  },
};
