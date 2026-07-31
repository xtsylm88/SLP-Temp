// frontend/src/services/apiClient.ts

import { ApiResponse, JenisLayanan, Permohonan } from '../../../shared/types';

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error(`[ApiClient Error ${endpoint}]:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal terhubung ke server Express',
        code: 'NETWORK_ERROR',
      };
    }
  }

  public getHealth() {
    return this.request<{ status: string }>('/health');
  }

  public getJenisLayanan() {
    return this.request<JenisLayanan[]>('/jenis-layanan');
  }

  public submitPermohonan(payload: Record<string, unknown>) {
    return this.request<Permohonan>('/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public getAdminDashboard() {
    return this.request<{ stats: Record<string, number> }>('/admin/dashboard');
  }
}

export const apiClient = new ApiClient();
