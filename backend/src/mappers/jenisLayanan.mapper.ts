// backend/src/mappers/jenisLayanan.mapper.ts
import { JenisLayanan, FieldSchemaItem } from '../types/appscript';

export interface JenisLayananAdminDTO {
  id: string;
  nama: string;
  deskripsi: string;
  schema_version: number;
  field_schema: FieldSchemaItem[];
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export function toJenisLayananAdminDTO(item: JenisLayanan): JenisLayananAdminDTO {
  return {
    id: item.id || '',
    nama: item.nama || '',
    deskripsi: item.deskripsi || '',
    schema_version: Number(item.schema_version) || 1,
    field_schema: Array.isArray(item.field_schema) ? item.field_schema : [],
    aktif: Boolean(item.aktif),
    created_at: item.created_at || '',
    updated_at: item.updated_at || '',
  };
}

export function toJenisLayananListAdminDTO(items: JenisLayanan[]): JenisLayananAdminDTO[] {
  return (items || []).map(toJenisLayananAdminDTO);
}
