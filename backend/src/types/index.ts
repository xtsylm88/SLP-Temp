// backend/src/types/index.ts

import { Request } from 'express';
import { JwtPayload } from './auth';

export type AuthenticatedUser = JwtPayload;

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface CacheEntry<T> {
  data: T;
  expiry: number;
}
