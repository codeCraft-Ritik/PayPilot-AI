import { Request, Response, NextFunction } from 'express';
import { orderRepository } from './order.repository.js';

export class OrderController {
  public getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const order = orderRepository.getById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          error: `Order '${id}' not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  public getAll(_req: Request, res: Response, next: NextFunction): void {
    try {
      const orders = orderRepository.getAll();
      res.json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
