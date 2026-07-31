// backend/src/routes/jenisLayanan.routes.ts

import { Router } from 'express';
import { getJenisLayanan } from '../controllers/jenisLayanan.controller';

const router = Router();

router.get('/', getJenisLayanan);

export default router;
