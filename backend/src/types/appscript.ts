// backend/src/types/appscript.ts
/**
 * Type definitions untuk Google Apps Script communication envelope dan domain models.
 */

export interface AppsScriptEnvelope<T = Record<string, unknown>> {
  secret: string;
  traceId: string;
  timestamp: string;
  action: string;
  payload: T;
}

export interface AppsScriptResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

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
  created_at: string;
  updated_at: string;
}

export interface PermohonanInput {
  nama: string;
  jabatan?: string;
  nip?: string;
  instansi?: string;
  wilayah?: string;
  kontak?: string;
  email: string;
  jenis_layanan_id: string;
  schema_version?: number;
  detail_json?: Record<string, unknown> | string;
  pic?: string;
  catatan?: string;
}

export interface PermohonanResult {
  request_id: string;
  status: string;
  created_at: string;
}

export interface PermohonanDetail extends PermohonanInput {
  request_id: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface PermohonanPublic {
  request_id: string;
  created_at: string;
  jenis_layanan: string;
  status: string;
}

export interface UpdateStatusInput {
  request_id: string;
  status: string;
  pic?: string;
  catatan?: string;
}

export interface SoftDeleteInput {
  request_id: string;
  deleted_by?: string;
}

export interface AdminUserResponse {
  email: string;
  nama: string;
  role: string;
  aktif: boolean;
  last_login?: string;
}

export interface UpdateLastLoginInput {
  email: string;
  last_login: string;
  last_login_ip?: string;
  last_login_trace_id?: string;
}

export interface PermohonanAdmin extends PermohonanDetail {
  deleted_at?: string;
  deleted_by?: string;
}

export interface SaveJenisInput {
  id: string;
  nama: string;
  deskripsi?: string;
  schema_version?: number;
  field_schema: FieldSchemaItem[] | string;
  aktif?: boolean;
}

export interface UpdateJenisInput {
  id?: string;
  nama?: string;
  deskripsi?: string;
  schema_version?: number;
  field_schema?: FieldSchemaItem[] | string;
  aktif?: boolean;
}

export interface PermohonanListQuery {
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

export interface PaginatedPermohonanAdmin {
  items: PermohonanAdmin[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AuditLogEntry {
  timestamp: string;
  trace_id: string;
  request_id: string;
  level: string;
  service: string;
  action: string;
  message: string;
  payload: Record<string, unknown> | string;
  actor_email?: string;
}

export interface AuditLogListQuery {
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

export interface PaginatedAuditLog {
  items: AuditLogEntry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface HealthStatusResponse {
  success: boolean;
  services: {
    express: 'UP' | 'DOWN';
    appsScript: 'UP' | 'DOWN';
    cache: 'UP' | 'DOWN';
  };
  timestamp: string;
  details?: {
    appsScriptCached?: boolean;
    appsScriptLatencyMs?: number;
  };
}
