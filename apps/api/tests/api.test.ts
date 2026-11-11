import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { app } from '../src/app.js';
import { deterministicRankingEngine } from '../src/modules/recommendations/ranking.engine.js';
import { deterministicFallbackProvider } from '../src/modules/ai/fallback.provider.js';
import { productService } from '../src/modules/products/product.service.js';
import { paymentService } from '../src/modules/payments/payment.service.js';
import { orderRepository } from '../src/modules/orders/order.repository.js';
import { createTestRequester } from './test-client.js';

const testClient = createTestRequester(app);
const request = (_app: unknown) => testClient.req();

describe('PayPilot AI API & Business Logic', () => {
  beforeAll(async () => {
    await testClient.start();
  });

  afterAll(async () => {
    await testClient.stop();
  });
  describe('Health Endpoint', () => {
    it('returns healthy status with AI and PayPal metadata', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('aiProvider');
      expect(res.body).toHaveProperty('paypalEnvironment', 'sandbox');
    });
  });

  describe('Product Catalogue', () => {
    it('returns list of curated sample products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThan(15);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('price');
      expect(res.body.data[0]).toHaveProperty('isSampleData', true);
    });

    it('filters products by category correctly', async () => {
      const res = await request(app).get('/api/products?category=audio');
      expect(res.status).toBe(200);
      expect(res.body.data.every((p: any) => p.category === 'audio')).toBe(true);
    });

    it('retrieves single product by ID', async () => {
      const res = await request(app).get('/api/products/prod-aud-01');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toContain('Sony WH-1000XM5');
    });

    it('returns 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/non-existent-id-12345');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('AI Intent Parser & Ranking Engine', () => {
    it('correctly extracts budget in USD from natural language', async () => {
      const intent = await deterministicFallbackProvider.extractIntent(
        'Find wireless headphones under $150 with good battery life'
      );
      expect(intent.category).toBe('audio');
      expect(intent.targetBudget?.amount).toBe(150);
      expect(intent.targetBudget?.currency).toBe('USD');
      expect(intent.mustHaveFeatures).toContain('wireless');
      expect(intent.mustHaveFeatures).toContain('battery');
    });

    it('correctly extracts budget in INR and converts transparently', async () => {
      const intent = await deterministicFallbackProvider.extractIntent(
        'Looking for headphones under ₹3000 with mic for office calls'
      );
      expect(intent.category).toBe('audio');
      expect(intent.targetBudget?.amount).toBe(3000);
      expect(intent.targetBudget?.currency).toBe('INR');
      expect(intent.targetBudget?.normalizedAmountUsd).toBeCloseTo(35.93, 1);
    });

    it('ranks products deterministically based on budget and features', () => {
      const products = productService.getProducts({ category: 'audio' });
      const intent = {
        rawQuery: 'Best headphones under $200 with anc',
        category: 'audio' as const,
        targetBudget: {
          amount: 200,
          currency: 'USD' as const,
          normalizedAmountUsd: 200,
          isStrict: true,
        },
        mustHaveFeatures: ['anc', 'wireless'],
        niceToHaveFeatures: [],
        preferredBrands: [],
        priorities: ['price' as const, 'battery' as const],
      };

      const explanations = {
        'prod-aud-02': { whyItFits: 'Fits budget', tradeOffs: 'Bulkier', keyDifferentiator: '50h battery' },
      };

      const result = deterministicRankingEngine.rankProducts(products, intent, explanations);
      expect(result.recommendations.length).toBeGreaterThan(0);
      // Top recommendation should be within or close to budget
      expect(result.recommendations[0].matchScore).toBeGreaterThan(70);
    });
  });

  describe('Payment Integrity & Server Price Recalculation', () => {
    it('creates a checkout order and calculates totals authoritatively', async () => {
      const payload = {
        items: [
          { productId: 'prod-aud-02', quantity: 2 }, // $129.99 * 2 = $259.98
        ],
        currency: 'USD',
      };

      const res = await request(app).post('/api/payments/create-order').send(payload);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.subtotal).toBe(259.98);
      expect(res.body.data.order.shippingFee).toBe(0); // Free shipping over $50
      expect(res.body.data.order.totalAmount).toBe(259.98);
      expect(res.body.data).toHaveProperty('paypalOrderId');
    });

    it('rejects manipulated invalid quantities or missing products', async () => {
      const payload = {
        items: [{ productId: 'invalid-product-fake', quantity: 1 }],
      };

      const res = await request(app).post('/api/payments/create-order').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('captures payment and transitions order status to COMPLETED', async () => {
      // 1. Create order
      const createRes = await request(app).post('/api/payments/create-order').send({
        items: [{ productId: 'prod-per-02', quantity: 1 }], // $99.99
      });
      const { order, paypalOrderId } = createRes.body.data;

      // 2. Capture payment
      const captureRes = await request(app).post('/api/payments/capture-order').send({
        orderId: order.id,
        paypalOrderId,
      });

      expect(captureRes.status).toBe(200);
      expect(captureRes.body.success).toBe(true);
      expect(captureRes.body.data.status).toBe('COMPLETED');
      expect(captureRes.body.data).toHaveProperty('paypalCaptureId');
      expect(captureRes.body.data).toHaveProperty('verifiedAt');
    });

    it('demonstrates idempotency on repeated capture calls', async () => {
      const createRes = await request(app).post('/api/payments/create-order').send({
        items: [{ productId: 'prod-per-02', quantity: 1 }],
      });
      const { order, paypalOrderId } = createRes.body.data;

      // First capture
      await request(app).post('/api/payments/capture-order').send({
        orderId: order.id,
        paypalOrderId,
      });

      // Second capture call should succeed idempotently without error
      const secondCapture = await request(app).post('/api/payments/capture-order').send({
        orderId: order.id,
        paypalOrderId,
      });

      expect(secondCapture.status).toBe(200);
      expect(secondCapture.body.data.status).toBe('COMPLETED');
    });
  });

  describe('Shopping Insights Dashboard', () => {
    it('calculates shopping insights accurately from completed orders', async () => {
      const res = await request(app).get('/api/insights');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('completedOrdersCount');
      expect(res.body.data).toHaveProperty('totalSandboxSpendUsd');
      expect(res.body.data).toHaveProperty('categorySpending');
    });
  });

  describe('Channel3 100M+ Products Sponsor Track ($1,500 Prize)', () => {
    it('exposes Channel3 status and catalog metrics', async () => {
      const res = await request(app).get('/api/channel3/status');
      expect(res.status).toBe(200);
      expect(res.body.sponsor).toBe('Channel3');
      expect(res.body.indexedCatalogSize).toContain('100,000,000+');
    });

    it('queries Channel3 product graph for items', async () => {
      const res = await request(app)
        .post('/api/channel3/search')
        .send({ query: 'wireless headphones', limit: 4 });
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('source');
      expect(res.body).toHaveProperty('totalAvailable');
    });
  });

  describe('Autonomous Agentic Commerce Loop ($5,000 Track)', () => {
    it('executes end-to-end multi-step agent flow and pre-stages PayPal checkout', async () => {
      const res = await request(app)
        .post('/api/agent/autonomous-plan')
        .send({
          goal: 'Equip my desk with wireless headphones and an ergonomic mouse under $300',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const plan = res.body.plan;
      expect(plan.targetBudgetUsd).toBe(300);
      expect(plan.traces.length).toBe(6); // 6 distinct agent reasoning steps
      expect(plan.traces[0].type).toBe('intent_decomposition');
      expect(plan.traces[1].type).toBe('channel3_query');
      expect(plan.traces[2].type).toBe('spec_evaluation');
      expect(plan.traces[3].type).toBe('budget_optimization');
      expect(plan.traces[4].type).toBe('cart_assembly');
      expect(plan.traces[5].type).toBe('payment_preparation');
      expect(plan.bundleTotalUsd).toBeLessThanOrEqual(300);
      expect(plan.selectedProducts.length).toBeGreaterThanOrEqual(2);
      expect(plan.isReadyForPayment).toBe(true);
      expect(plan.preStagedCartItems.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('BuyWard: Autonomous Procurement & Commerce Matrix', () => {
    it('decomposes complex intent with 5% tax/shipping buffer', async () => {
      const res = await request(app)
        .post('/api/intent/parse')
        .send({
          prompt: 'Equip a two-person podcasting starter kit under $280 total with USB-C mics, closed-back headphones, and boom arms',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const intent = res.body.intent;
      expect(intent.hardBudgetMax).toBe(280);
      expect(intent.allocatedBufferUsd).toBeCloseTo(14.0, 1); // 5% of 280
      expect(intent.requiredCategories.length).toBeGreaterThanOrEqual(3);
      const totalSubBudgets = intent.requiredCategories.reduce(
        (acc: number, c: any) => acc + c.allocatedSubBudgetUsd,
        0
      );
      expect(totalSubBudgets).toBeLessThanOrEqual(intent.netProcurementBudgetUsd + 1);
    });

    it('refines mission constraints conversatively without restarting', async () => {
      const initialRes = await request(app)
        .post('/api/intent/parse')
        .send({ prompt: 'Equip an ergonomic developer workspace under $350 total' });
      const initialIntent = initialRes.body.intent;

      const refinedRes = await request(app)
        .post('/api/intent/refine')
        .send({
          currentState: initialIntent,
          refinementPrompt: 'Lower the hard budget to $300 and prioritize fastest delivery',
        });
      expect(refinedRes.status).toBe(200);
      expect(refinedRes.body.success).toBe(true);
      expect(refinedRes.body.intent.hardBudgetMax).toBe(300);
      expect(refinedRes.body.intent.deliveryPriority).toBe('fastest');
    });

    it('queries Channel3 multi-merchant candidate SKUs with arbitrage savings', async () => {
      const res = await request(app)
        .post('/api/discovery/search')
        .send({ categoryQuery: 'Microphone', limit: 4 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.skus.length).toBeGreaterThan(0);
      expect(res.body.skus[0]).toHaveProperty('skuId');
      expect(res.body.skus[0]).toHaveProperty('merchantDomain');
      expect(res.body.skus[0]).toHaveProperty('arbitrageSavings');
    });

    it('evaluates Spend Policy Passport across 3 financial zones', async () => {
      // Test Green Zone
      const greenRes = await request(app)
        .post('/api/guardrails/evaluate')
        .send({
          items: [{ skuId: 'sku-1', category: 'Audio', price: 180, merchantDomain: 'bhphoto.com' }],
          totalCost: 180,
          policyOverride: { maxAutoApproveLimit: 250, hardTransactionCeiling: 300 },
        });
      expect(greenRes.status).toBe(200);
      expect(greenRes.body.evaluation.zone).toBe('GREEN');
      expect(greenRes.body.evaluation.isAutonomousApproved).toBe(true);
      expect(greenRes.body.evaluation.policyPassportHash.length).toBe(64); // SHA-256

      // Test Yellow Zone (HITL)
      const yellowRes = await request(app)
        .post('/api/guardrails/evaluate')
        .send({
          items: [{ skuId: 'sku-1', category: 'Audio', price: 275, merchantDomain: 'bhphoto.com' }],
          totalCost: 275,
          policyOverride: { maxAutoApproveLimit: 250, hardTransactionCeiling: 300 },
        });
      expect(yellowRes.body.evaluation.zone).toBe('YELLOW');
      expect(yellowRes.body.evaluation.requiresHumanApproval).toBe(true);

      // Test Red Zone (Hard Block)
      const redRes = await request(app)
        .post('/api/guardrails/evaluate')
        .send({
          items: [{ skuId: 'sku-1', category: 'Audio', price: 350, merchantDomain: 'bhphoto.com' }],
          totalCost: 350,
          policyOverride: { maxAutoApproveLimit: 250, hardTransactionCeiling: 300 },
        });
      expect(redRes.body.evaluation.zone).toBe('RED');
      expect(redRes.body.evaluation.isBlocked).toBe(true);
    });

    it('creates PayPal order embedding cryptographic passport hash in custom_id', async () => {
      const res = await request(app)
        .post('/api/paypal/orders/create')
        .send({
          items: [{ skuId: 'sku-1', title: 'Podcasting Mic', price: 99.0, merchantDomain: 'amazon.com' }],
          totalAmountUsd: 99.0,
          policyPassportHash: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
          orderReference: 'TEST-BUYWARD-001',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('paypalOrderId');
      expect(res.body.data.customIdEmbedded).toContain('abcdef0123456789');
    });

    it('simulates autonomous price sniper drop and immediate capture', async () => {
      const rulesRes = await request(app).get('/api/sniper/rules');
      const targetRule = rulesRes.body.rules[0];
      expect(targetRule).toBeDefined();

      const dropRes = await request(app)
        .post('/api/sniper/simulate-drop')
        .send({ ruleId: targetRule.ruleId, simulatedDropPrice: 59.0 });
      expect(dropRes.status).toBe(200);
      expect(dropRes.body.success).toBe(true);
      expect(dropRes.body.priceMatched).toBe(true);
      expect(dropRes.body).toHaveProperty('orderId');
      expect(dropRes.body).toHaveProperty('captureId');
      expect(dropRes.body.savingsAchieved).toBeGreaterThan(0);
    });
  });
});
