// backend/src/routes/submit.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { appscriptService } from '../services/appscript.service';
import { validateSubmit } from '../utils/validator';
import { getOrGenerateTraceId } from '../utils/trace';

const router = Router();

/**
 * POST /api/submit
 * Mengirimkan permohonan pendampingan baru
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const traceId = req.traceId || getOrGenerateTraceId(req);

    // 1. Validasi input sebelum dikirim ke Apps Script
    const validatedPayload = validateSubmit(req.body, traceId);

    // 2. Kirim ke Google Apps Script via AppScript Service
    const result = await appscriptService.submitPermohonan(validatedPayload, traceId);

    res.status(201).json({
      success: true,
      message: 'Permohonan pendampingan berhasil dikirim.',
      data: result,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
