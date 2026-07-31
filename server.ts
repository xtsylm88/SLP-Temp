// server.ts

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend/src/app';
import { config } from './backend/src/config';

async function startServer() {
  const PORT = config.port || 3000;

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express Backend] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Environment] ${config.nodeEnv}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
