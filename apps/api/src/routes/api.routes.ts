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
import { procurementIntentService } from '../modules/procurement/intent.service.js';
import { channel3ProcurementClient } from '../modules/procurement/channel3_client.js';
import { knapsackBundleOptimizer } from '../modules/procurement/optimizer.js';
import { spendGuardrailsService } from '../modules/procurement/guardrails.service.js';
import { payPalProcurementService } from '../modules/procurement/paypal_operations.service.js';
import { priceSniperService } from '../modules/procurement/price_sniper.service.js';

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

// --- MODULE 1: Intent & Vision Endpoints ---
apiRouter.post('/intent/parse', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ success: false, error: 'A natural language prompt is required' });
    return;
  }
  const result = procurementIntentService.parseNaturalLanguageMission(prompt);
  res.json({ success: true, intent: result });
});

apiRouter.post('/intent/vision', (req, res) => {
  const { imageBase64OrUrl, missionHint } = req.body;
  const result = procurementIntentService.parseVisionInput(imageBase64OrUrl || '', missionHint);
  res.json({ success: true, intent: result });
});

apiRouter.post('/intent/refine', (req, res) => {
  const { currentState, refinementPrompt } = req.body;
  if (!currentState || !refinementPrompt) {
    res.status(400).json({ success: false, error: 'currentState and refinementPrompt are required' });
    return;
  }
  const refined = procurementIntentService.refineMissionConstraints(currentState, refinementPrompt);
  res.json({ success: true, intent: refined });
});

// --- MODULE 2: Channel3 Universal Discovery & Optimization ---
apiRouter.post('/discovery/search', async (req, res, next) => {
  try {
    const { categoryQuery, maxPriceUsd, limit } = req.body;
    const result = await channel3ProcurementClient.searchCategorySKUs(categoryQuery || 'audio', {
      maxPriceUsd,
      limit,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/procurement/optimize', (req, res) => {
  const { requiredCategories, candidatePool, hardBudgetMax, lockedItems } = req.body;
  const bundles = knapsackBundleOptimizer.assembleThreeTiers(
    requiredCategories || [],
    candidatePool || [],
    hardBudgetMax || 300,
    lockedItems || []
  );
  res.json({ success: true, bundles });
});

// --- MODULE 4: Spend Policy Passport & Guardrails ---
apiRouter.get('/guardrails/policy', (_req, res) => {
  res.json({ success: true, policy: spendGuardrailsService.getPolicy() });
});

apiRouter.post('/guardrails/policy', (req, res) => {
  const updated = spendGuardrailsService.updatePolicy(req.body.policy || {});
  res.json({ success: true, policy: updated });
});

apiRouter.post('/guardrails/evaluate', (req, res) => {
  const { items, totalCost, policyOverride } = req.body;
  const evaluation = spendGuardrailsService.evaluateCart(
    items || [],
    totalCost || 0,
    policyOverride
  );
  res.json({ success: true, evaluation });
});

// --- MODULE 5: PayPal Financial Operations Layer ---
apiRouter.post('/paypal/orders/create', async (req, res, next) => {
  try {
    const { items, totalAmountUsd, policyPassportHash, orderReference } = req.body;
    const result = await payPalProcurementService.createProcurementOrder(
      items || [],
      totalAmountUsd || 0,
      policyPassportHash || 'hash_default',
      orderReference || `ORD-${Date.now()}`
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/paypal/orders/:orderId/capture', async (req, res, next) => {
  try {
    const result = await payPalProcurementService.captureProcurementOrder(req.params.orderId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/paypal/invoices/split', async (req, res, next) => {
  try {
    const result = await payPalProcurementService.executeSquadBuySplitInvoicing(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/paypal/orders/:captureId/refund', async (req, res, next) => {
  try {
    const result = await payPalProcurementService.executeSLAWatchdogRefund(
      req.params.captureId,
      req.body.reason
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/paypal/webhooks', (req, res) => {
  const event = req.body;
  res.json({
    received: true,
    eventType: event?.event_type || 'CHECKOUT.ORDER.APPROVED',
    processedAt: new Date().toISOString(),
  });
});

// --- MODULE 6: Price Sniper Endpoints ---
apiRouter.get('/sniper/rules', (_req, res) => {
  res.json({ success: true, rules: priceSniperService.getRules() });
});

apiRouter.post('/sniper/rules', (req, res) => {
  const rule = priceSniperService.createRule(req.body);
  res.json({ success: true, rule });
});

apiRouter.post('/sniper/simulate-drop', async (req, res, next) => {
  try {
    const { ruleId, simulatedDropPrice } = req.body;
    const result = await priceSniperService.simulatePriceDrop(ruleId, simulatedDropPrice);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

apiRouter.all('/sniper/check-all', async (_req, res, next) => {
  try {
    const result = await priceSniperService.checkAllRules();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
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

