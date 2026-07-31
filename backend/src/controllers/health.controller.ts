// backend/src/controllers/health.controller.ts

import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { HTTP_STATUS } from '../../../shared/constants';

export const getHealth = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.OK).json(
    createSuccessResponse({
      status: 'UP',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }, 'Backend service is healthy')
  );
};
