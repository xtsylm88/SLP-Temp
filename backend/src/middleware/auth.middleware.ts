// backend/src/middleware/auth.middleware.ts

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { config } from '../config';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Skeleton Google OAuth verification for Express Admin routes
  const authHeader = req.headers.authorization;
  const userEmail = req.headers['x-user-email'] as string;

  if (!authHeader && !userEmail) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(
        createErrorResponse(
          'Otentikasi diperlukan. Silakan login sebagai Admin.',
          ERROR_CODES.UNAUTHORIZED
        )
      );
  }

  const email = userEmail || 'admin@example.com';
  const isAdmin = config.adminEmails.includes(email.toLowerCase());

  if (!isAdmin && config.nodeEnv === 'production') {
    return res
      .status(HTTP_STATUS.FORBIDDEN)
      .json(
        createErrorResponse(
          'Akses ditolak. Email tidak terdaftar dalam daftar Admin.',
          ERROR_CODES.FORBIDDEN
        )
      );
  }

  req.user = {
    email,
    role: 'ADMIN',
  };

  next();
};
