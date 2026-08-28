// frontend/src/services/adminJenisLayanan.service.ts
import { JenisLayananAdminDTO } from '../types/admin';
import { mapJenisLayananListAdminDTO, mapJenisLayananAdminDTO } from '../mappers/jenisLayanan.mapper';

export const adminJenisLayananService = {
  async getJenisLayananList(): Promise<JenisLayananAdminDTO[]> {
    const res = await fetch('/admin/jenis-layanan', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal mengambil daftar master jenis layanan.');
    }

    const body = await res.json();
    return mapJenisLayananListAdminDTO(body.data);
  },

  async createJenisLayanan(payload: {
    id: string;
    nama: string;
    deskripsi?: string;
    schema_version?: number;
    field_schema: any;
    aktif?: boolean;
  }): Promise<{ id: string; nama: string }> {
    const res = await fetch('/admin/jenis-layanan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal menambahkan jenis layanan.');
    }

    const body = await res.json();
    return body.data;
  },

  async updateJenisLayanan(
    id: string,
    payload: {
      nama: string;
      deskripsi?: string;
      schema_version?: number;
      field_schema?: any;
      aktif?: boolean;
    }
  ): Promise<{ id: string; updated: boolean }> {
    const res = await fetch(`/admin/jenis-layanan/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal memperbarui jenis layanan.');
    }

    const body = await res.json();
    return body.data;
  },

  async deleteJenisLayanan(id: string): Promise<{ id: string; updated: boolean }> {
    const res = await fetch(`/admin/jenis-layanan/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal nonaktifkan jenis layanan.');
    }

    const body = await res.json();
    return body.data;
  },
};
