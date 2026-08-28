// frontend/src/mappers/jenisLayanan.mapper.ts
import { JenisLayananAdminDTO } from '../types/admin';

export function mapJenisLayananAdminDTO(data: any): JenisLayananAdminDTO {
  return {
    id: data.id || '',
    nama: data.nama || '',
    deskripsi: data.deskripsi || '',
    schema_version: Number(data.schema_version) || 1,
    field_schema: Array.isArray(data.field_schema) ? data.field_schema : [],
    aktif: Boolean(data.aktif),
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
  };
}

export function mapJenisLayananListAdminDTO(data: any): JenisLayananAdminDTO[] {
  return Array.isArray(data) ? data.map(mapJenisLayananAdminDTO) : [];
}
