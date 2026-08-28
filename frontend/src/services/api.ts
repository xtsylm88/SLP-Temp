// frontend/src/services/api.ts

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  traceId?: string;
  cached?: boolean;
}

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public traceId?: string;
  public isNetworkOrTimeout: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', traceId?: string, isNetworkOrTimeout = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.traceId = traceId;
    this.isNetworkOrTimeout = isNetworkOrTimeout;
  }
}

/**
 * Base HTTP fetch wrapper untuk berkomunikasi ke Express Backend
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const baseUrl = '/api';
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch (err) {
    throw new ApiError(
      'Kami belum dapat memastikan apakah permintaan berhasil terhubung karena terjadi gangguan jaringan/komunikasi.',
      0,
      'NETWORK_ERROR',
      undefined,
      true
    );
  }

  let jsonResult: ApiResponse<T>;
  try {
    jsonResult = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      'Respons server bukan format JSON yang valid.',
      response.status,
      'INVALID_JSON',
      undefined,
      false
    );
  }

  if (!response.ok || !jsonResult.success) {
    const isTimeout = jsonResult.code === 'GATEWAY_TIMEOUT' || jsonResult.code === 'APPS_SCRIPT_TIMEOUT' || jsonResult.code === 'APPS_SCRIPT_NETWORK_ERROR';
    throw new ApiError(
      jsonResult.message || 'Terjadi kesalahan pada server Express',
      response.status,
      jsonResult.code || 'UNKNOWN_ERROR',
      jsonResult.traceId,
      isTimeout
    );
  }

  return jsonResult;
}
