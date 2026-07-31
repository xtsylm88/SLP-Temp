// backend/src/middleware/errorHandler.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { createErrorResponse, getHttpStatusFromCode } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const errorHandlerMiddleware = (
  err: Error & { code?: string; statusCode?: number },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error('[GlobalErrorHandler]', err);

  const statusCode = err.statusCode || getHttpStatusFromCode(err.code) || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Terjadi kesalahan pada server internal';
  const code = err.code || ERROR_CODES.INTERNAL_ERROR;

  res.status(statusCode).json(createErrorResponse(message, code));
};
