// backend/src/routes/admin.routes.ts

import { Router } from 'express';
import { getAdminDashboardData } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authMiddleware, getAdminDashboardData);

export default router;
