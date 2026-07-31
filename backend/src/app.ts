// backend/src/app.ts

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { loggerMiddleware } from './middleware/logger.middleware';
import { rateLimiterMiddleware } from './middleware/rateLimiter.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';

const app = express();

// Express Configuration & Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(loggerMiddleware);
app.use(rateLimiterMiddleware);

// API Routes Mounted at /api
app.use('/api', routes);

// 404 Handler for undefined API routes
app.use('/api/*', notFoundMiddleware);

// Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
