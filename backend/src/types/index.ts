// backend/src/types/index.ts

import { Request } from 'express';
import { UserRole } from '../../../shared/types';

export interface AuthenticatedUser {
  email: string;
  name?: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface CacheEntry<T> {
  data: T;
  expiry: number;
}
