// shared/interfaces/index.ts

import { ApiResponse, JenisLayanan, Permohonan } from '../types';

export interface IAppScriptRequestPayload {
  action: string;
  payload?: Record<string, unknown>;
  secret?: string;
}

export interface IAppScriptResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface IBaseService<T> {
  getAll(): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  create(item: Partial<T>): Promise<ApiResponse<T>>;
}

export type IJenisLayananService = IBaseService<JenisLayanan>;
export type IPermohonanService = IBaseService<Permohonan>;
