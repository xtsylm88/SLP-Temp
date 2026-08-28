// frontend/src/services/adminPermohonan.service.ts
import {
  PaginatedPermohonanAdminDTO,
  PermohonanAdminDTO,
  PermohonanFilterParams,
  UpdateStatusPayload,
} from '../types/admin';
import { mapPaginatedPermohonanAdminDTO, mapPermohonanAdminDTO } from '../mappers/permohonan.mapper';

export const adminPermohonanService = {
  async getPermohonanList(params: PermohonanFilterParams): Promise<PaginatedPermohonanAdminDTO> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.status) queryParams.set('status', params.status);
    if (params.jenisLayananId) queryParams.set('jenisLayananId', params.jenisLayananId);
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const res = await fetch(`/admin/permohonan?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal mengambil daftar permohonan admin.');
    }

    const body = await res.json();
    return mapPaginatedPermohonanAdminDTO(body.data);
  },

  async getPermohonanDetail(requestId: string): Promise<PermohonanAdminDTO> {
    const res = await fetch(`/admin/permohonan/${encodeURIComponent(requestId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Permohonan dengan Request ID '${requestId}' tidak ditemukan.`);
    }

    const body = await res.json();
    return mapPermohonanAdminDTO(body.data);
  },

  async updateStatus(requestId: string, payload: UpdateStatusPayload): Promise<{ request_id: string; status: string }> {
    const res = await fetch(`/admin/permohonan/${encodeURIComponent(requestId)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal memperbarui status permohonan.');
    }

    const body = await res.json();
    return body.data;
  },

  async softDelete(requestId: string): Promise<{ request_id: string; deleted: boolean }> {
    const res = await fetch(`/admin/permohonan/${encodeURIComponent(requestId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal menghapus permohonan.');
    }

    const body = await res.json();
    return body.data;
  },
};
