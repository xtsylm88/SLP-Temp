// backend/src/utils/errors.ts
/**
 * Custom Error Classes untuk Express Business Layer
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly traceId?: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', traceId?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.traceId = traceId;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST', traceId?: string) {
    super(message, 400, code, traceId);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', traceId?: string) {
    super(message, 401, code, traceId);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN', traceId?: string) {
    super(message, 403, code, traceId);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', code = 'NOT_FOUND', traceId?: string) {
    super(message, 404, code, traceId);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', code = 'INTERNAL_ERROR', traceId?: string) {
    super(message, 500, code, traceId);
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message = 'Google Apps Script Gateway Timeout', code = 'GATEWAY_TIMEOUT', traceId?: string) {
    super(message, 504, code, traceId);
  }
}
