// backend/src/services/appscript.service.ts
import { envConfig } from '../config/env';
import {
  AppsScriptEnvelope,
  AppsScriptResponse,
  JenisLayanan,
  PermohonanInput,
  PermohonanResult,
  PermohonanDetail,
  PermohonanPublic,
  UpdateStatusInput,
  SoftDeleteInput,
  AdminUserResponse,
  UpdateLastLoginInput,
  PermohonanListQuery,
  PaginatedPermohonanAdmin,
  AuditLogEntry,
  AuditLogListQuery,
  PaginatedAuditLog,
} from '../types/appscript';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  GatewayTimeoutError,
} from '../utils/errors';

/**
 * Service adapter terpusat untuk seluruh komunikasi Express -> Google Apps Script Web App.
 * TIDAK ADA MOCK ATAU FALLBACK DATA. Seluruh request langsung dieksekusi ke Google Apps Script Web App.
 */
export class AppScriptService {
  private readonly appsScriptUrl: string;
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor() {
    this.appsScriptUrl = envConfig.appsScriptUrl;
    this.secret = envConfig.appsScriptSecret;
    this.timeoutMs = envConfig.timeoutMs;
  }

  /**
   * Method private terpusat untuk mengeksekusi request HTTP POST ke Google Apps Script.
   * Bertanggung jawab membangun envelope, menangani timeout, dan protocol mapping.
   */
  private async callAppsScript<T>(
    action: string,
    payload: Record<string, unknown> = {},
    traceId: string
  ): Promise<T> {
    if (!this.appsScriptUrl) {
      throw new InternalServerError(
        'Konfigurasi APPS_SCRIPT_URL belum diisi pada environment variables backend (APPS_SCRIPT_URL kosong).',
        'MISSING_APPS_SCRIPT_URL',
        traceId
      );
    }

    const envelope: AppsScriptEnvelope = {
      secret: this.secret,
      traceId,
      timestamp: new Date().toISOString(),
      action,
      payload,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelope),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      const isAbort = err instanceof Error && (err.name === 'AbortError' || err.message.includes('abort'));
      if (isAbort) {
        throw new GatewayTimeoutError(
          `Google Apps Script timeout (${this.timeoutMs}ms) saat memproses action '${action}'.`,
          'APPS_SCRIPT_TIMEOUT',
          traceId
        );
      }
      throw new GatewayTimeoutError(
        `Gagal terhubung ke Google Apps Script: ${err instanceof Error ? err.message : String(err)}`,
        'APPS_SCRIPT_NETWORK_ERROR',
        traceId
      );
    } finally {
      clearTimeout(timer);
    }

    // Google Apps Script Web App (ContentService) mengembalikan HTTP 200 secara transport.
    // Express menentukan sukses atau gagal dari body JSON application-level.
    let jsonResult: AppsScriptResponse<T>;
    try {
      jsonResult = (await response.json()) as AppsScriptResponse<T>;
    } catch (err) {
      throw new InternalServerError(
        'Respons dari Google Apps Script bukan format JSON yang valid.',
        'MALFORMED_APPS_SCRIPT_RESPONSE',
        traceId
      );
    }

    // Jika application-level status success === false, petakan ke Express Error
    if (!jsonResult.success) {
      const code = jsonResult.code || 'UNKNOWN_ERROR';
      const msg = jsonResult.message || `Error dari Apps Script (${code})`;

      switch (code) {
        case 'UNAUTHORIZED':
          throw new UnauthorizedError(msg, code, traceId);
        case 'BAD_REQUEST':
          throw new BadRequestError(msg, code, traceId);
        case 'NOT_FOUND':
          throw new NotFoundError(msg, code, traceId);
        case 'INTERNAL_ERROR':
        default:
          throw new InternalServerError(msg, code, traceId);
      }
    }

    return jsonResult.data as T;
  }

  /**
   * Health Check terautentikasi ke Google Apps Script
   */
  public async health(traceId: string): Promise<{ status: string; service: string }> {
    return this.callAppsScript<{ status: string; service: string }>('health', {}, traceId);
  }

  /**
   * Mengambil daftar Master Jenis Layanan aktif
   */
  public async getJenisLayanan(traceId: string): Promise<JenisLayanan[]> {
    return this.callAppsScript<JenisLayanan[]>('getJenisLayanan', {}, traceId);
  }

  /**
   * Mengambil seluruh daftar Master Jenis Layanan (termasuk yang non-aktif) untuk Admin Dashboard
   */
  public async getJenisLayananAdmin(traceId: string): Promise<JenisLayanan[]> {
    return this.callAppsScript<JenisLayanan[]>('getJenisLayanan', { includeInactive: true }, traceId);
  }

  /**
   * Menyimpan Jenis Layanan baru
   */
  public async saveJenis(payload: Record<string, unknown>, traceId: string): Promise<{ id: string; nama: string }> {
    return this.callAppsScript<{ id: string; nama: string }>('saveJenis', payload, traceId);
  }

  /**
   * Memperbarui Jenis Layanan
   */
  public async updateJenis(id: string, payload: Record<string, unknown>, traceId: string): Promise<{ id: string; updated: boolean }> {
    return this.callAppsScript<{ id: string; updated: boolean }>('updateJenis', { id, ...payload }, traceId);
  }

  /**
   * Nonaktifkan Jenis Layanan (soft delete)
   */
  public async deleteJenis(id: string, traceId: string): Promise<{ id: string; updated: boolean }> {
    return this.callAppsScript<{ id: string; updated: boolean }>('deleteJenis', { id }, traceId);
  }
  public async getJenisLayananById(id: string, traceId: string): Promise<JenisLayanan> {
    return this.callAppsScript<JenisLayanan>('getJenisLayananById', { id }, traceId);
  }

  /**
   * Mengajukan Permohonan Pendampingan Baru
   */
  public async submitPermohonan(payload: PermohonanInput, traceId: string): Promise<PermohonanResult> {
    return this.callAppsScript<PermohonanResult>('submitPermohonan', payload as unknown as Record<string, unknown>, traceId);
  }

  /**
   * Mencari detail permohonan berdasarkan Request ID (Akan digunakan oleh Admin Dashboard)
   */
  public async findPermohonan(requestId: string, traceId: string): Promise<PermohonanDetail> {
    return this.callAppsScript<PermohonanDetail>('findPermohonan', { request_id: requestId }, traceId);
  }

  /**
   * Mencari DTO permohonan publik berdasarkan Request ID (Akses Publik)
   */
  public async findPermohonanPublic(requestId: string, traceId: string): Promise<PermohonanPublic> {
    return this.callAppsScript<PermohonanPublic>('findPermohonanPublic', { request_id: requestId }, traceId);
  }

  /**
   * Memperbarui status permohonan (Akan digunakan oleh Admin Dashboard)
   */
  public async updateStatus(payload: UpdateStatusInput, traceId: string): Promise<{ request_id: string; status: string }> {
    return this.callAppsScript<{ request_id: string; status: string }>('updateStatus', payload as unknown as Record<string, unknown>, traceId);
  }

  /**
   * Soft delete permohonan (Akan digunakan oleh Admin Dashboard)
   */
  public async softDelete(payload: SoftDeleteInput, traceId: string): Promise<{ request_id: string; deleted: boolean }> {
    return this.callAppsScript<{ request_id: string; deleted: boolean }>('softDelete', payload as unknown as Record<string, unknown>, traceId);
  }

  /**
   * Mencari data admin berdasarkan email dari Sheet User Admin
   */
  public async findAdminByEmail(email: string, traceId: string): Promise<AdminUserResponse> {
    return this.callAppsScript<AdminUserResponse>('findAdminByEmail', { email }, traceId);
  }

  /**
   * Memperbarui kolom last_login, last_login_ip, dan last_login_trace_id pada Sheet User Admin saat login berhasil
   */
  public async updateLastLogin(payload: UpdateLastLoginInput, traceId: string): Promise<void> {
    await this.callAppsScript<void>('updateLastLogin', payload as unknown as Record<string, unknown>, traceId);
  }

  /**
   * Mengambil daftar permohonan terpaginasi, terfilter, dan tersaring untuk Dashboard Admin
   */
  public async findPermohonanList(query: PermohonanListQuery, traceId: string): Promise<PaginatedPermohonanAdmin> {
    return this.callAppsScript<PaginatedPermohonanAdmin>('findPermohonanList', query as unknown as Record<string, unknown>, traceId);
  }

  /**
   * Menyimpan log audit ke Sheet Log via action recordAuditEvent
   */
  public async recordAuditEvent(
    logData: {
      trace_id?: string;
      request_id?: string;
      level?: string;
      service?: string;
      action?: string;
      message?: string;
      payload?: Record<string, unknown>;
      actor_email?: string;
    },
    traceId: string
  ): Promise<void> {
    await this.callAppsScript<void>('recordAuditEvent', logData, traceId);
  }

  /**
   * Alias/backward compatibility untuk recordAuditEvent
   */
  public async writeLog(
    logData: {
      trace_id?: string;
      request_id?: string;
      level?: string;
      service?: string;
      action?: string;
      message?: string;
      payload?: Record<string, unknown>;
      actor_email?: string;
    },
    traceId: string
  ): Promise<void> {
    return this.recordAuditEvent(logData, traceId);
  }

  /**
   * Mengambil daftar Audit Log terpaginasi, terfilter, dan tersortir
   */
  public async findAuditLogList(query: AuditLogListQuery, traceId: string): Promise<PaginatedAuditLog> {
    return this.callAppsScript<PaginatedAuditLog>('findAuditLogList', query as unknown as Record<string, unknown>, traceId);
  }

  /**
   * Mengambil seluruh baris Audit Log berdasarkan trace_id
   */
  public async findAuditTrace(requestedTraceId: string, traceId: string): Promise<AuditLogEntry[]> {
    return this.callAppsScript<AuditLogEntry[]>('findAuditTrace', { trace_id: requestedTraceId }, traceId);
  }
}

export const appscriptService = new AppScriptService();
