// backend/src/controllers/jenisLayanan.controller.ts

import { Request, Response } from 'express';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const getJenisLayanan = async (req: Request, res: Response) => {
  // Skeleton placeholder for Sprint 1
  return res
    .status(HTTP_STATUS.NOT_IMPLEMENTED)
    .json(
      createErrorResponse(
        'Endpoint /api/jenis-layanan belum diimplementasikan (Akan aktif pada Sprint 2)',
        ERROR_CODES.NOT_IMPLEMENTED
      )
    );
};
