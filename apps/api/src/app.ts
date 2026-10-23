import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRouter } from './routes/api.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

// Security and CORS
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow frontend embeds and PayPal scripts
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'PayPal-Request-Id'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API Router
app.use('/api', apiRouter);

// Root greeting & status
app.get('/', (_req, res) => {
  res.json({
    app: 'PayPilot AI API',
    tagline: 'Your AI Shopping Copilot',
    version: '1.0.0',
    documentation: '/api/health',
    mode: env.NODE_ENV,
  });
});

// Error handling middleware
app.use(errorHandler);
