// backend/src/routes/health.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';
import { getOrGenerateTraceId } from '../utils/trace';

const router = Router();

/**
 * GET /health
 * Aggregated health status check untuk Express, Cache, dan Apps Script
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const traceId = req.traceId || getOrGenerateTraceId(req);
    const healthResult = await healthService.getHealthStatus(traceId);
    res.json(healthResult);
  } catch (err) {
    next(err);
  }
});

export default router;
