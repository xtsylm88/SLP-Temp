// backend/src/routes/submit.routes.ts

import { Router } from 'express';
import { submitPermohonan } from '../controllers/submit.controller';
import { validateSubmitPermohonan } from '../validators';

const router = Router();

router.post('/', validateSubmitPermohonan, submitPermohonan);

export default router;
