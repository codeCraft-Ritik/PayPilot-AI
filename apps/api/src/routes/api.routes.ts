import { Router } from 'express';
import { productController } from '../modules/products/product.controller.js';
import { recommendationController } from '../modules/recommendations/recommendation.controller.js';
import { paymentController } from '../modules/payments/payment.controller.js';
import { orderController } from '../modules/orders/order.controller.js';
import { insightsController } from '../modules/insights/insights.controller.js';
import { aiService } from '../modules/ai/ai.service.js';
import { paypalClient } from '../modules/payments/paypal.client.js';
import { channel3Service } from '../modules/channel3/channel3.service.js';
import { autonomousAgentService } from '../modules/agent/autonomous.agent.js';

export const apiRouter = Router();

// Health & System Info (Includes Sponsor Integrations & Agentic Status)
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiProvider: aiService.getActiveProvider().getProviderName(),
    isUsingAiFallback: aiService.isUsingFallback(),
    paypalConfigured: paypalClient.isConfigured(),
    paypalEnvironment: 'sandbox',
    channel3: channel3Service.getStatus(),
    agenticCommerceActive: true,
  });
});

// Channel3 Sponsor Track API ($1,500 Prize - 100M+ Products)
apiRouter.get('/channel3/status', (_req, res) => {
  res.json(channel3Service.getStatus());
});

apiRouter.post('/channel3/search', async (req, res, next) => {
  try {
    const { query, category, maxPriceUsd, limit } = req.body;
    const results = await channel3Service.search(query || '', {
      category,
      maxPriceUsd,
      limit,
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Autonomous Agentic Commerce Flow ($5,000 Prize Track)
apiRouter.post('/agent/autonomous-plan', async (req, res, next) => {
  try {
    const { goal, targetBudgetUsd, currency } = req.body;
    if (!goal || typeof goal !== 'string') {
      res.status(400).json({ success: false, error: 'A natural language goal is required' });
      return;
    }
    const plan = await autonomousAgentService.executePlan({
      goal,
      targetBudgetUsd,
      currency,
    });
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
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

