// backend/src/validators/index.ts

import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../utils';
import { ERROR_CODES, HTTP_STATUS } from '../../../shared/constants';

export const validateSubmitPermohonan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skeleton validator for Sprint 1
  const { jenis_layanan_id, nama_pemohon, email_pemohon } = req.body || {};
  
  if (req.method === 'POST') {
    const errors: Record<string, string> = {};
    if (!jenis_layanan_id) errors.jenis_layanan_id = 'Jenis layanan ID Wajib diisi';
    if (!nama_pemohon) errors.nama_pemohon = 'Nama pemohon wajib diisi';
    if (!email_pemohon) errors.email_pemohon = 'Email pemohon wajib diisi';

    if (Object.keys(errors).length > 0) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(createErrorResponse('Validasi gagal', ERROR_CODES.VALIDATION_ERROR, errors));
    }
  }

  next();
};
