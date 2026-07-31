// backend/src/middleware/notFound.middleware.ts

import { Request, Response } from 'express';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const notFoundMiddleware = (req: Request, res: Response) => {
  res
    .status(HTTP_STATUS.NOT_FOUND)
    .json(
      createErrorResponse(
        `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
        ERROR_CODES.NOT_FOUND
      )
    );
};
