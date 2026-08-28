// backend/src/routes/permohonan-status.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { appscriptService } from '../services/appscript.service';
import { getOrGenerateTraceId } from '../utils/trace';
import { BadRequestError } from '../utils/errors';

const router = Router();

/**
 * GET /api/permohonan/status/:id
 * Endpoint publik untuk memeriksa status permohonan pendampingan.
 * Hanya mengembalikan Public DTO (request_id, status, jenis_layanan, created_at).
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const traceId = req.traceId || getOrGenerateTraceId(req);
    const requestId = req.params.id ? req.params.id.trim() : '';

    if (!requestId) {
      throw new BadRequestError('Request ID wajib diisi', 'MISSING_REQUEST_ID', traceId);
    }

    const requestIdRegex = /^REQ-\d{4}-\d{6}$/i;
    if (!requestIdRegex.test(requestId)) {
      throw new BadRequestError('Format Request ID tidak valid. Contoh: REQ-2026-000001', 'INVALID_REQUEST_ID_FORMAT', traceId);
    }

    const publicData = await appscriptService.findPermohonanPublic(requestId.toUpperCase(), traceId);

    res.json({
      success: true,
      data: publicData,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
