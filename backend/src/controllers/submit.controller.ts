// backend/src/controllers/submit.controller.ts

import { Request, Response } from 'express';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const submitPermohonan = async (req: Request, res: Response) => {
  // Skeleton placeholder for Sprint 1
  return res
    .status(HTTP_STATUS.NOT_IMPLEMENTED)
    .json(
      createErrorResponse(
        'Endpoint /api/submit belum diimplementasikan (Akan aktif pada Sprint 3)',
        ERROR_CODES.NOT_IMPLEMENTED
      )
    );
};
