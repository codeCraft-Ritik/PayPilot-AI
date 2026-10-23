import { Router } from 'express';
import { productController } from '../modules/products/product.controller.js';
import { recommendationController } from '../modules/recommendations/recommendation.controller.js';
import { paymentController } from '../modules/payments/payment.controller.js';
import { orderController } from '../modules/orders/order.controller.js';
import { insightsController } from '../modules/insights/insights.controller.js';
import { aiService } from '../modules/ai/ai.service.js';
import { paypalClient } from '../modules/payments/paypal.client.js';

export const apiRouter = Router();

// Health & System Info
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiProvider: aiService.getActiveProvider().getProviderName(),
    isUsingAiFallback: aiService.isUsingFallback(),
    paypalConfigured: paypalClient.isConfigured(),
    paypalEnvironment: 'sandbox',
  });
});

// Products
apiRouter.get('/products', (req, res, next) => productController.getAll(req, res, next));
apiRouter.get('/products/categories', (req, res, next) => productController.getCategories(req, res, next));
apiRouter.get('/products/:id', (req, res, next) => productController.getById(req, res, next));

// Recommendations & AI Shopping Copilot
apiRouter.post('/recommendations/assistant', (req, res, next) =>
  recommendationController.assistantQuery(req, res, next)
);
apiRouter.post('/recommendations/compare', (req, res, next) =>
  recommendationController.compare(req, res, next)
);

// Payments (PayPal Sandbox)
apiRouter.get('/payments/config', (req, res) => paymentController.getConfig(req, res));
apiRouter.post('/payments/create-order', (req, res, next) =>
  paymentController.createOrder(req, res, next)
);
apiRouter.post('/payments/capture-order', (req, res, next) =>
  paymentController.captureOrder(req, res, next)
);

// Orders
apiRouter.get('/orders', (req, res, next) => orderController.getAll(req, res, next));
apiRouter.get('/orders/:id', (req, res, next) => orderController.getById(req, res, next));

// Insights
apiRouter.get('/insights', (req, res, next) => insightsController.getInsights(req, res, next));
