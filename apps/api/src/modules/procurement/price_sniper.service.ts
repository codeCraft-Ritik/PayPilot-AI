import { PriceSniperRule } from '@paypilot/shared';
import { payPalProcurementService } from './paypal_operations.service.js';
import { PROCUREMENT_CATALOG_SEED } from './channel3_client.js';

export class PriceSniperService {
  private rules: Map<string, PriceSniperRule> = new Map();

  constructor() {
    // Seed an initial demo rule for judges
    this.createRule({
      skuId: 'sku-pod-mic-01',
      productTitle: 'Audio-Technica ATR2100x-USB Dynamic Microphone',
      merchantDomain: 'bhphotovideo.com',
      initialPrice: 79.0,
      targetPrice: 65.0,
      userEmail: 'procurement-agent@paypilot.internal',
      spendPolicyHash: 'passport_sha256_demo_seed',
    });
  }

  public createRule(input: {
    skuId: string;
    productTitle?: string;
    merchantDomain?: string;
    initialPrice: number;
    targetPrice: number;
    userEmail: string;
    spendPolicyHash: string;
  }): PriceSniperRule {
    const ruleId = `snip_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const product = PROCUREMENT_CATALOG_SEED.find((p) => p.skuId === input.skuId);

    const rule: PriceSniperRule = {
      ruleId,
      skuId: input.skuId,
      productTitle: input.productTitle || product?.title || 'Monitored Retail SKU',
      merchantDomain: input.merchantDomain || product?.merchantDomain || 'retailer.com',
      initialPrice: input.initialPrice,
      targetPrice: input.targetPrice,
      currentPrice: input.initialPrice,
      status: 'ARMED',
      userEmail: input.userEmail,
      spendPolicyHash: input.spendPolicyHash,
      createdAt: new Date().toISOString(),
    };

    this.rules.set(ruleId, rule);
    return rule;
  }

  public getRules(): PriceSniperRule[] {
    return Array.from(this.rules.values());
  }

  public async simulatePriceDrop(ruleId: string, simulatedDropPrice?: number): Promise<{
    rule: PriceSniperRule;
    priceMatched: boolean;
    orderId: string;
    captureId: string;
    receiptId: string;
    savingsAchieved: number;
  }> {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Sniper rule '${ruleId}' not found`);
    }

    const dropPrice = simulatedDropPrice || rule.targetPrice - 5.0; // drops $5 below target
    rule.currentPrice = dropPrice;
    rule.status = 'PRICE_MATCHED';
    rule.triggeredAt = new Date().toISOString();

    // Execute Autonomous PayPal Capture
    const orderRef = `SNIPER-${rule.ruleId}`;
    const product = PROCUREMENT_CATALOG_SEED.find((p) => p.skuId === rule.skuId) || {
      skuId: rule.skuId,
      title: rule.productTitle,
      category: 'Audio',
      merchantName: 'B&H Photo Video',
      merchantDomain: rule.merchantDomain,
      price: dropPrice,
      retailAvgPrice: rule.initialPrice,
      arbitrageSavings: Math.max(0, rule.initialPrice - dropPrice),
      shippingCost: 0,
      stockStatus: 'in_stock' as const,
      rating: 4.8,
      reviewCount: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
      specs: {},
      aiValueScore: 98,
      compatibilityTags: ['usb-c'],
    };

    const orderResult = await payPalProcurementService.createProcurementOrder(
      [product],
      dropPrice,
      rule.spendPolicyHash,
      orderRef
    );

    const captureResult = await payPalProcurementService.captureProcurementOrder(orderResult.paypalOrderId);

    rule.status = 'EXECUTED';
    rule.executedOrderId = orderResult.paypalOrderId;
    rule.executedCaptureId = captureResult.captureId;

    return {
      rule,
      priceMatched: true,
      orderId: orderResult.paypalOrderId,
      captureId: captureResult.captureId,
      receiptId: captureResult.receiptId,
      savingsAchieved: Math.round((rule.initialPrice - dropPrice) * 100) / 100,
    };
  }

  public async checkAllRules(): Promise<{ checked: number; triggered: number; results: any[] }> {
    const armed = Array.from(this.rules.values()).filter((r) => r.status === 'ARMED');
    const results: any[] = [];
    for (const rule of armed) {
      if (rule.currentPrice <= rule.targetPrice) {
        const res = await this.simulatePriceDrop(rule.ruleId, rule.currentPrice);
        results.push(res);
      }
    }
    return {
      checked: armed.length,
      triggered: results.length,
      results,
    };
  }
}

export const priceSniperService = new PriceSniperService();
