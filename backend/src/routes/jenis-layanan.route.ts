// backend/src/routes/jenis-layanan.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { appscriptService } from '../services/appscript.service';
import { cacheService } from '../services/cache.service';
import { envConfig } from '../config/env';
import { validateJenisLayananId } from '../utils/validator';
import { getOrGenerateTraceId } from '../utils/trace';
import { JenisLayanan } from '../types/appscript';

const router = Router();
const CACHE_KEY = 'jenis-layanan';

/**
 * GET /api/jenis-layanan
 * Mengambil daftar master jenis layanan aktif (menggunakan Cache TTL 5 menit)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const traceId = req.traceId || getOrGenerateTraceId(req);

    // 1. Cek Cache
    const cachedData = cacheService.get<JenisLayanan[]>(CACHE_KEY);
    if (cachedData) {
      res.json({
        success: true,
        data: cachedData,
        cached: true,
      });
      return;
    }

    // 2. Jika Cache Miss, panggil Apps Script Service
    const data = await appscriptService.getJenisLayanan(traceId);

    // 3. Simpan ke Cache
    cacheService.set(CACHE_KEY, data, envConfig.cacheTtlMs);

    res.json({
      success: true,
      data,
      cached: false,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/jenis-layanan/:id
 * Mengambil detail jenis layanan berdasarkan ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const traceId = req.traceId || getOrGenerateTraceId(req);
    const validId = validateJenisLayananId(req.params.id, traceId);

    const data = await appscriptService.getJenisLayananById(validId, traceId);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
