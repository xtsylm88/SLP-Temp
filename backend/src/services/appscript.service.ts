// backend/src/services/appscript.service.ts

import { ApiResponse } from '../../../shared/types';

/**
 * Service placeholder for communicating with Google Apps Script Web App.
 * Express serves as the sole gateway for frontend requests to Apps Script.
 * 
 * TODO (Sprint 2 & Sprint 3): Implement real HTTP gateway communication with Apps Script using fetch
 * and secret token verification once Apps Script deployment URL is configured.
 */
class AppScriptService {
  /**
   * TODO: Implement callAppsScript method in future sprint
   */
  public async callAppsScript<T>(
    action: string,
    method: 'GET' | 'POST' = 'GET',
    payload?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    console.log(`[AppScriptService Skeleton] Action: ${action}, Method: ${method}, Payload:`, payload);
    return {
      success: false,
      message: 'Apps Script gateway belum diaktifkan (Sprint 1 Skeleton)',
      code: 'NOT_IMPLEMENTED',
    };
  }

  /**
   * TODO: Implement getJenisLayananCached in Sprint 2
   */
  public async getJenisLayananCached<T>(): Promise<ApiResponse<T>> {
    return {
      success: false,
      message: 'Jenis Layanan cache service belum diaktifkan (Sprint 1 Skeleton)',
      code: 'NOT_IMPLEMENTED',
    };
  }

  /**
   * TODO: Implement cache clearing helper
   */
  public clearCache(): void {
    // No-op for Sprint 1
  }
}

export const appScriptService = new AppScriptService();

