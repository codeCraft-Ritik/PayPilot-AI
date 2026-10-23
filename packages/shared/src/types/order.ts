import { Product } from './product.js';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number; // USD
}

export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'CAPTURED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export interface OrderItemRecord {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  items: OrderItemRecord[];
  subtotal: number;
  shippingFee: number;
  estimatedTax: number;
  totalAmount: number;
  currency: 'USD';
  status: OrderStatus;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  payerEmail?: string;
  payerName?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  paymentDetails?: {
    processor: 'PAYPAL_SANDBOX';
    status: string;
    captureId: string;
    createTime: string;
    updateTime: string;
    currency: string;
    amount: string;
  };
}

export interface OrderSummaryMetrics {
  totalOrders: number;
  totalSpentUsd: number;
  categoryBreakdown: Record<string, number>;
  recentOrders: OrderRecord[];
}
