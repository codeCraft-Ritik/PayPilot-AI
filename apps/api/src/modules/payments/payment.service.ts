import {
  CreateCartOrderInput,
  CaptureOrderInput,
  OrderRecord,
  OrderItemRecord,
} from '@paypilot/shared';
import { productService } from '../products/product.service.js';
import { orderRepository, IOrderRepository } from '../orders/order.repository.js';
import { paypalClient, PayPalClient } from './paypal.client.js';

export class PaymentService {
  constructor(
    private orderRepo: IOrderRepository = orderRepository,
    private paypal: PayPalClient = paypalClient
  ) {}

  public async createCheckoutOrder(input: CreateCartOrderInput): Promise<{
    order: OrderRecord;
    paypalOrderId: string;
    isSimulated: boolean;
  }> {
    // 1. Recalculate ALL prices authoritatively from database
    const verifiedItems: OrderItemRecord[] = [];
    let calculatedSubtotal = 0;

    for (const item of input.items) {
      const product = productService.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product ID '${item.productId}' not found in catalogue`);
      }

      if (item.quantity <= 0 || item.quantity > 20) {
        throw new Error(`Invalid quantity ${item.quantity} for '${product.name}'`);
      }

      const itemTotal = Math.round(product.price * item.quantity * 100) / 100;
      calculatedSubtotal = Math.round((calculatedSubtotal + itemTotal) * 100) / 100;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });
    }

    // 2. Shipping & Tax policy: Free shipping over $50, otherwise $10 flat
    const shippingFee = calculatedSubtotal >= 50 ? 0 : 10;
    const estimatedTax = 0; // Transparent sandbox zero-tax policy
    const totalAmount = Math.round((calculatedSubtotal + shippingFee + estimatedTax) * 100) / 100;

    // 3. Generate Local Order Record
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderNumber = `PP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      estimatedTax,
      totalAmount,
      currency: 'USD',
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 4. Create PayPal Order on Sandbox
    const paypalOrder = await this.paypal.createOrder({
      totalAmount,
      currency: 'USD',
      orderReference: orderNumber,
      items: verifiedItems.map((it) => ({
        name: it.name,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })),
    });

    newOrder.paypalOrderId = paypalOrder.id;

    // Persist to local repository
    this.orderRepo.create(newOrder);

    return {
      order: newOrder,
      paypalOrderId: paypalOrder.id,
      isSimulated: Boolean(paypalOrder.isSimulated),
    };
  }

  public async captureCheckoutPayment(input: CaptureOrderInput): Promise<OrderRecord> {
    const order = this.orderRepo.getById(input.orderId);
    if (!order) {
      throw new Error(`Order ${input.orderId} does not exist`);
    }

    // Check for duplicate capture attempt (Idempotency)
    if (order.status === 'COMPLETED' || order.status === 'CAPTURED') {
      return order; // Already successfully captured
    }

    if (order.paypalOrderId && order.paypalOrderId !== input.paypalOrderId) {
      throw new Error('PayPal Order ID mismatch with registered order reference');
    }

    // Capture on PayPal Sandbox
    const captureResult = await this.paypal.captureOrder(input.paypalOrderId);

    if (captureResult.status !== 'COMPLETED') {
      this.orderRepo.update(order.id, {
        status: 'FAILED',
      });
      throw new Error(`PayPal payment status was '${captureResult.status}', expected 'COMPLETED'`);
    }

    const captureDetails = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
    const captureId = captureDetails?.id || `CAP-${Date.now()}`;
    const payerEmail = captureResult.payer?.email_address;
    const payerName = captureResult.payer?.name
      ? `${captureResult.payer.name.given_name || ''} ${captureResult.payer.name.surname || ''}`.trim()
      : undefined;

    // Update order with verified payment status
    const verifiedOrder = this.orderRepo.update(order.id, {
      status: 'COMPLETED',
      paypalCaptureId: captureId,
      payerEmail,
      payerName,
      verifiedAt: new Date().toISOString(),
      paymentDetails: {
        processor: 'PAYPAL_SANDBOX',
        status: 'COMPLETED',
        captureId,
        createTime: captureDetails?.create_time || new Date().toISOString(),
        updateTime: captureDetails?.update_time || new Date().toISOString(),
        currency: 'USD',
        amount: order.totalAmount.toFixed(2),
      },
    });

    return verifiedOrder;
  }
}

export const paymentService = new PaymentService();
