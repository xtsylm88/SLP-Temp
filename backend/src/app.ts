// backend/src/app.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middleware/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

import healthRouter from './routes/health.route';
import jenisLayananRouter from './routes/jenis-layanan.route';
import submitRouter from './routes/submit.route';
import permohonanStatusRouter from './routes/permohonan-status.route';
import { authRouter } from './routes/auth.route';
import { adminRouter } from './routes/admin.route';

const app = express();
app.set('trust proxy', 1);

// 1. Logger Middleware
app.use(requestLogger);

// 2. Rate Limiter Middleware
app.use(rateLimiter);

// 3. Cookie Parser Middleware
app.use(cookieParser());

// 4. JSON Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Register Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);
app.use('/api/jenis-layanan', jenisLayananRouter);
app.use('/api/submit', submitRouter);
app.use('/api/permohonan/status', permohonanStatusRouter);

// Register Auth Routes (Dukungan /auth/login, /auth/callback, /auth/me, /auth/logout dan /api/auth/*)
app.use('/auth', authRouter);
app.use('/api/auth', authRouter);

// Register Admin Protected Routes (/admin/*)
app.use('/admin', adminRouter);

// 6. Not Found Handler Middleware (untuk /api/* atau endpoint Express lainnya)
app.use('/api/*', notFoundHandler);

// 7. Global Error Handler Middleware
app.use(errorHandler);

export default app;
