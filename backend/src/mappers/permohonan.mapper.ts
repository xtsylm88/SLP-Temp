// backend/src/mappers/permohonan.mapper.ts
import { PermohonanAdmin, PaginatedPermohonanAdmin } from '../types/appscript';

export interface PermohonanAdminDTO {
  request_id: string;
  created_at: string;
  updated_at: string;
  nama: string;
  jabatan?: string;
  nip?: string;
  instansi?: string;
  wilayah?: string;
  kontak?: string;
  email: string;
  jenis_layanan_id: string;
  schema_version: number;
  detail_json: Record<string, unknown>;
  status: string;
  pic?: string;
  catatan?: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface PaginatedPermohonanAdminDTO {
  items: PermohonanAdminDTO[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function toPermohonanAdminDTO(item: PermohonanAdmin): PermohonanAdminDTO {
  return {
    request_id: item.request_id || '',
    created_at: item.created_at || '',
    updated_at: item.updated_at || '',
    nama: item.nama || '',
    jabatan: item.jabatan || '',
    nip: item.nip || '',
    instansi: item.instansi || '',
    wilayah: item.wilayah || '',
    kontak: item.kontak || '',
    email: item.email || '',
    jenis_layanan_id: item.jenis_layanan_id || '',
    schema_version: Number(item.schema_version) || 1,
    detail_json: typeof item.detail_json === 'object' && item.detail_json !== null
      ? item.detail_json
      : {},
    status: item.status || 'DRAFT',
    pic: item.pic || '',
    catatan: item.catatan || '',
    deleted_at: item.deleted_at,
    deleted_by: item.deleted_by,
  };
}

export function toPaginatedPermohonanAdminDTO(
  paginated: PaginatedPermohonanAdmin
): PaginatedPermohonanAdminDTO {
  return {
    items: (paginated.items || []).map(toPermohonanAdminDTO),
    page: paginated.page || 1,
    pageSize: paginated.pageSize || 10,
    total: paginated.total || 0,
    totalPages: paginated.totalPages || 1,
  };
}
