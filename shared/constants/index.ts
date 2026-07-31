// shared/constants/index.ts

export const APP_CONSTANTS = {
  APP_NAME: 'Sistem Layanan Pendampingan',
  API_PREFIX: '/api',
  REQUEST_ID_PREFIX: 'REQ',
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 menit TTL
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB limit
  ALLOWED_FILE_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'],
  ALLOWED_FILE_EXTENSIONS: ['.pdf', '.docx', '.png', '.jpg', '.jpeg'],
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED_ACCESS',
  FORBIDDEN: 'FORBIDDEN_ACTION',
  NOT_FOUND: 'RESOURCE_NOT_FOUND',
  APPS_SCRIPT_ERROR: 'APPS_SCRIPT_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  INTERNAL_ERROR: 'INTERNAL_SERVER_ERROR',
};
