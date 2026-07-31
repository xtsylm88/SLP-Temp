// backend/src/routes/index.ts

import { Router } from 'express';
import healthRoutes from './health.routes';
import jenisLayananRoutes from './jenisLayanan.routes';
import submitRoutes from './submit.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/jenis-layanan', jenisLayananRoutes);
router.use('/submit', submitRoutes);
router.use('/admin', adminRoutes);

export default router;
