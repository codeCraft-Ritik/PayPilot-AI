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
} from '@paypilot/shared';

const API_BASE = '/api';

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
};
