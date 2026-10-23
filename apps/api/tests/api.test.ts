import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { deterministicRankingEngine } from '../src/modules/recommendations/ranking.engine.js';
import { deterministicFallbackProvider } from '../src/modules/ai/fallback.provider.js';
import { productService } from '../src/modules/products/product.service.js';
import { paymentService } from '../src/modules/payments/payment.service.js';
import { orderRepository } from '../src/modules/orders/order.repository.js';

describe('PayPilot AI API & Business Logic', () => {
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
});
