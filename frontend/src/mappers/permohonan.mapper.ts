// frontend/src/mappers/permohonan.mapper.ts
import { PermohonanAdminDTO, PaginatedPermohonanAdminDTO } from '../types/admin';

export function mapPermohonanAdminDTO(data: any): PermohonanAdminDTO {
  return {
    request_id: data.request_id || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    nama: data.nama || '',
    jabatan: data.jabatan || '',
    nip: data.nip || '',
    instansi: data.instansi || '',
    wilayah: data.wilayah || '',
    kontak: data.kontak || '',
    email: data.email || '',
    jenis_layanan_id: data.jenis_layanan_id || '',
    schema_version: Number(data.schema_version) || 1,
    detail_json: typeof data.detail_json === 'object' && data.detail_json !== null ? data.detail_json : {},
    status: data.status || 'DRAFT',
    pic: data.pic || '',
    catatan: data.catatan || '',
    deleted_at: data.deleted_at,
    deleted_by: data.deleted_by,
  };
}

export function mapPaginatedPermohonanAdminDTO(data: any): PaginatedPermohonanAdminDTO {
  return {
    items: Array.isArray(data?.items) ? data.items.map(mapPermohonanAdminDTO) : [],
    page: Number(data?.page) || 1,
    pageSize: Number(data?.pageSize) || 10,
    total: Number(data?.total) || 0,
    totalPages: Number(data?.totalPages) || 1,
  };
}
