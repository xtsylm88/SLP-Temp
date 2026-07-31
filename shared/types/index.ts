// shared/types/index.ts

export type RequestStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export type UserRole = 'PUBLIC' | 'ADMIN' | 'SUPER_ADMIN';

export interface FieldSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'date' | 'file' | 'select' | 'textarea';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
  validationRule?: string;
}

export interface FieldSchema {
  fields: Record<string, FieldSchemaProperty>;
  version: number;
}

export interface JenisLayanan {
  id: string;
  nama: string;
  deskripsi: string;
  field_schema: FieldSchema;
  schema_version: number;
  aktif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Permohonan {
  id: string;
  request_id: string; // Format REQ-YYYY-000001
  jenis_layanan_id: string;
  schema_version: number;
  detail_json: Record<string, unknown>;
  nama_pemohon: string;
  email_pemohon: string;
  status: RequestStatus;
  catatan_admin?: string;
  file_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
  timestamp?: string;
}
