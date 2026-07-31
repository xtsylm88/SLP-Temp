// backend/src/utils/index.ts

import { ApiResponse } from '../../../shared/types';
import { HTTP_STATUS } from '../../../shared/constants';

export const createSuccessResponse = <T>(
  data: T,
  message = 'Success'
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
};

export const createErrorResponse = (
  message = 'An error occurred',
  code = 'ERROR',
  errors?: Record<string, string>
): ApiResponse<null> => {
  return {
    success: false,
    message,
    code,
    errors,
    timestamp: new Date().toISOString(),
  };
};

export const getHttpStatusFromCode = (code?: string): number => {
  switch (code) {
    case 'UNAUTHORIZED_ACCESS':
      return HTTP_STATUS.UNAUTHORIZED;
    case 'FORBIDDEN_ACTION':
      return HTTP_STATUS.FORBIDDEN;
    case 'RESOURCE_NOT_FOUND':
      return HTTP_STATUS.NOT_FOUND;
    case 'VALIDATION_ERROR':
      return HTTP_STATUS.BAD_REQUEST;
    case 'NOT_IMPLEMENTED':
      return HTTP_STATUS.NOT_IMPLEMENTED;
    case 'RATE_LIMIT_EXCEEDED':
      return HTTP_STATUS.TOO_MANY_REQUESTS;
    default:
      return HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
};
