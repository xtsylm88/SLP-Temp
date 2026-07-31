// backend/src/controllers/admin.controller.ts

import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const getAdminDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  // Skeleton placeholder for Sprint 1
  return res
    .status(HTTP_STATUS.NOT_IMPLEMENTED)
    .json(
      createErrorResponse(
        'Endpoint /api/admin belum diimplementasikan (Akan aktif pada Sprint 5)',
        ERROR_CODES.NOT_IMPLEMENTED
      )
    );
};
