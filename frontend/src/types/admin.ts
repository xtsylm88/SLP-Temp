// frontend/src/types/admin.ts

export interface FieldSchemaItem {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'file';
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

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

export interface PermohonanFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  jenisLayananId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | string;
}

export interface UpdateStatusPayload {
  status: string;
  pic?: string;
  catatan?: string;
}

export interface AuditLogDTO {
  timestamp: string;
  trace_id: string;
  request_id: string;
  level: string;
  service: string;
  action: string;
  message: string;
  payload: Record<string, unknown> | string;
  actor_email: string;
}

export interface PaginatedAuditLogDTO {
  items: AuditLogDTO[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AuditLogFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  level?: string;
  service?: string;
  actorEmail?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | string;
}

export interface TraceTimelineDTO {
  traceId: string;
  entries: AuditLogDTO[];
}
