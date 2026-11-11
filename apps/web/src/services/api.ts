import {
  Product,
  ProductFilterOptions,
  ShoppingQueryInput,
  ShoppingAssistantResponse,
  CompareProductsInput,
  ComparisonResult,
  CreateCartOrderInput,
  CaptureOrderInput,
  OrderRecord,
  AutonomousAgentPlan,
  DecomposedMissionIntent,
  MultiMerchantSKU,
  ProcurementBundle,
  BundleTierType,
  SpendPolicyConfig,
  GuardrailEvaluation,
  PriceSniperRule,
  SplitInvoiceRequest,
  SplitInvoiceResponse,
} from '@paypilot/shared';

const rawApiUrl = (import.meta.env?.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawApiUrl
  ? (rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`).replace(/\/$/, '') +
    (rawApiUrl.endsWith('/api') ? '' : '/api')
  : '/api';

export interface SystemHealth {
  status: string;
  timestamp: string;
  aiProvider: string;
  isUsingAiFallback: boolean;
  paypalConfigured: boolean;
  paypalEnvironment: string;
}

export interface PaymentConfig {
  clientId: string;
  environment: string;
  isConfigured: boolean;
  currency: string;
}

export interface ShoppingInsightsData {
  completedOrdersCount: number;
  totalSandboxSpendUsd: number;
  averageOrderValueUsd: number;
  categorySpending: Record<string, number>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    itemsCount: number;
    paypalCaptureId?: string;
  }>;
  totalItemsPurchased: number;
}

export const api = {
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getPaymentConfig(): Promise<PaymentConfig> {
    const res = await fetch(`${API_BASE}/payments/config`);
    const data = await res.json();
    return data.data;
  },

  async getProducts(filter?: ProductFilterOptions): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filter?.category && filter.category !== 'all') params.set('category', filter.category);
    if (filter?.minPrice) params.set('minPrice', filter.minPrice.toString());
    if (filter?.maxPrice) params.set('maxPrice', filter.maxPrice.toString());
    if (filter?.searchQuery) params.set('search', filter.searchQuery);
    if (filter?.inStockOnly) params.set('inStockOnly', 'true');

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`Product ${id} not found`);
    const data = await res.json();
    return data.data;
  },

  async queryShoppingAssistant(input: ShoppingQueryInput): Promise<ShoppingAssistantResponse> {
    const res = await fetch(`${API_BASE}/recommendations/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to process shopping assistant query');
    }
    const data = await res.json();
    return data.data;
  },

  async compareProducts(input: CompareProductsInput): Promise<ComparisonResult> {
    const res = await fetch(`${API_BASE}/recommendations/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate product comparison');
    }
    const data = await res.json();
    return data.data;
  },

  async createCheckoutOrder(input: CreateCartOrderInput): Promise<{
    order: OrderRecord;
    paypalOrderId: string;
    isSimulated: boolean;
  }> {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to initialize checkout');
    }
    const data = await res.json();
    return data.data;
  },

  async captureCheckoutPayment(input: CaptureOrderInput): Promise<OrderRecord> {
    const res = await fetch(`${API_BASE}/payments/capture-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Payment capture failed');
    }
    const data = await res.json();
    return data.data;
  },

  async getOrderById(id: string): Promise<OrderRecord> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error(`Order ${id} not found`);
    const data = await res.json();
    return data.data;
  },

  async getInsights(): Promise<ShoppingInsightsData> {
    const res = await fetch(`${API_BASE}/insights`);
    if (!res.ok) throw new Error('Failed to load shopping insights');
    const data = await res.json();
    return data.data;
  },

  async runAutonomousAgent(input: {
    goal: string;
    targetBudgetUsd?: number;
    currency?: 'USD' | 'INR';
  }): Promise<AutonomousAgentPlan> {
    const res = await fetch(`${API_BASE}/agent/autonomous-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to execute autonomous agent plan');
    }
    const data = await res.json();
    return data.plan;
  },

  async getChannel3Status(): Promise<{
    sponsor: string;
    track: string;
    isLive: boolean;
    status: string;
    indexedCatalogSize: string;
  }> {
    const res = await fetch(`${API_BASE}/channel3/status`);
    if (!res.ok) throw new Error('Failed to fetch Channel3 status');
    return res.json();
  },

  // --- BuyWard / Procurement Endpoints ---
  async parseMissionIntent(prompt: string): Promise<DecomposedMissionIntent> {
    const res = await fetch(`${API_BASE}/intent/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Failed to parse mission intent');
    const data = await res.json();
    return data.intent;
  },

  async parseVisionMission(imageBase64OrUrl: string, missionHint?: string): Promise<DecomposedMissionIntent> {
    const res = await fetch(`${API_BASE}/intent/vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64OrUrl, missionHint }),
    });
    if (!res.ok) throw new Error('Failed to parse vision mission');
    const data = await res.json();
    return data.intent;
  },

  async refineMissionConstraints(
    currentState: DecomposedMissionIntent,
    refinementPrompt: string
  ): Promise<DecomposedMissionIntent> {
    const res = await fetch(`${API_BASE}/intent/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentState, refinementPrompt }),
    });
    if (!res.ok) throw new Error('Failed to refine constraints');
    const data = await res.json();
    return data.intent;
  },

  async searchProcurementDiscovery(
    categoryQuery: string,
    options?: { maxPriceUsd?: number; limit?: number }
  ): Promise<{ skus: MultiMerchantSKU[]; isLiveApi: boolean; totalFound: number }> {
    const res = await fetch(`${API_BASE}/discovery/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryQuery, ...options }),
    });
    if (!res.ok) throw new Error('Failed to query Channel3 discovery');
    return res.json();
  },

  async optimizeProcurementBundles(params: {
    requiredCategories: any[];
    candidatePool: MultiMerchantSKU[];
    hardBudgetMax: number;
    lockedItems?: MultiMerchantSKU[];
  }): Promise<Record<BundleTierType, ProcurementBundle>> {
    const res = await fetch(`${API_BASE}/procurement/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to optimize procurement bundles');
    const data = await res.json();
    return data.bundles;
  },

  async getSpendPolicy(): Promise<SpendPolicyConfig> {
    const res = await fetch(`${API_BASE}/guardrails/policy`);
    if (!res.ok) throw new Error('Failed to fetch spend policy');
    const data = await res.json();
    return data.policy;
  },

  async updateSpendPolicy(policy: Partial<SpendPolicyConfig>): Promise<SpendPolicyConfig> {
    const res = await fetch(`${API_BASE}/guardrails/policy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy }),
    });
    if (!res.ok) throw new Error('Failed to update spend policy');
    const data = await res.json();
    return data.policy;
  },

  async evaluateSpendGuardrails(params: {
    items: MultiMerchantSKU[];
    totalCost: number;
    policyOverride?: Partial<SpendPolicyConfig>;
  }): Promise<GuardrailEvaluation> {
    const res = await fetch(`${API_BASE}/guardrails/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to evaluate guardrails');
    const data = await res.json();
    return data.evaluation;
  },

  async createProcurementPayPalOrder(params: {
    items: MultiMerchantSKU[];
    totalAmountUsd: number;
    policyPassportHash: string;
    orderReference?: string;
  }): Promise<{ paypalOrderId: string; isSimulated: boolean; customIdEmbedded: string }> {
    const res = await fetch(`${API_BASE}/paypal/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to create PayPal procurement order');
    const data = await res.json();
    return data.data;
  },

  async captureProcurementPayPalOrder(orderId: string): Promise<{
    captureId: string;
    status: string;
    capturedAt: string;
    receiptId: string;
  }> {
    const res = await fetch(`${API_BASE}/paypal/orders/${orderId}/capture`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to capture PayPal procurement order');
    const data = await res.json();
    return data.data;
  },

  async executeSquadBuySplitInvoicing(params: SplitInvoiceRequest): Promise<SplitInvoiceResponse> {
    const res = await fetch(`${API_BASE}/paypal/invoices/split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to execute squad buy split invoicing');
    const data = await res.json();
    return data.data;
  },

  async executeSLAWatchdogRefund(captureId: string, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/paypal/orders/${captureId}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to execute SLA watchdog refund');
    const data = await res.json();
    return data.data;
  },

  async getSniperRules(): Promise<PriceSniperRule[]> {
    const res = await fetch(`${API_BASE}/sniper/rules`);
    if (!res.ok) throw new Error('Failed to fetch sniper rules');
    const data = await res.json();
    return data.rules;
  },

  async createSniperRule(rule: Partial<PriceSniperRule>): Promise<PriceSniperRule> {
    const res = await fetch(`${API_BASE}/sniper/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    if (!res.ok) throw new Error('Failed to create sniper rule');
    const data = await res.json();
    return data.rule;
  },

  async simulatePriceDrop(ruleId: string, simulatedDropPrice?: number): Promise<any> {
    const res = await fetch(`${API_BASE}/sniper/simulate-drop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId, simulatedDropPrice }),
    });
    if (!res.ok) throw new Error('Failed to simulate price drop');
    return res.json();
  },
};
