// frontend/src/types/index.ts

export * from '../../../shared/types';

export interface UIState {
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
}
