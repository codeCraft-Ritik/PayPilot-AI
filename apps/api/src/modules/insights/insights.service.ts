import { orderRepository, IOrderRepository } from '../orders/order.repository.js';
import { productService } from '../products/product.service.js';

export interface ShoppingInsights {
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

export class InsightsService {
  constructor(private orderRepo: IOrderRepository = orderRepository) {}

  public getInsights(): ShoppingInsights {
    const orders = this.orderRepo.getAll();
    const completed = orders.filter((o) => o.status === 'COMPLETED');

    let totalSandboxSpend = 0;
    let totalItems = 0;
    const categorySpending: Record<string, number> = {};

    for (const order of completed) {
      totalSandboxSpend += order.totalAmount;

      for (const item of order.items) {
        totalItems += item.quantity;
        const prod = productService.getProductById(item.productId);
        const cat = prod?.category || 'other';
        categorySpending[cat] = Math.round(((categorySpending[cat] || 0) + item.totalPrice) * 100) / 100;
      }
    }

    const aov = completed.length > 0 ? Math.round((totalSandboxSpend / completed.length) * 100) / 100 : 0;

    return {
      completedOrdersCount: completed.length,
      totalSandboxSpendUsd: Math.round(totalSandboxSpend * 100) / 100,
      averageOrderValueUsd: aov,
      categorySpending,
      recentOrders: orders.slice(0, 10).map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
        itemsCount: o.items.reduce((sum, it) => sum + it.quantity, 0),
        paypalCaptureId: o.paypalCaptureId,
      })),
      totalItemsPurchased: totalItems,
    };
  }
}

export const insightsService = new InsightsService();
