import { Request, Response, NextFunction } from 'express';
import { CreateCartOrderSchema, CaptureOrderSchema } from '@paypilot/shared';
import { paymentService } from './payment.service.js';
import { paypalClient } from './paypal.client.js';
import { env } from '../../config/env.js';

export class PaymentController {
  public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreateCartOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid order creation payload',
          details: parsed.error.format(),
        });
        return;
      }

      const result = await paymentService.createCheckoutOrder(parsed.data);
      res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Failed to create checkout order',
      });
    }
  }

  public async captureOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CaptureOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid capture payload',
          details: parsed.error.format(),
        });
        return;
      }

      const verifiedOrder = await paymentService.captureCheckoutPayment(parsed.data);
      res.json({
        success: true,
        data: verifiedOrder,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Payment capture failed',
      });
    }
  }

  public getConfig(_req: Request, res: Response): void {
    res.json({
      success: true,
      data: {
        clientId: env.PAYPAL_CLIENT_ID || 'demo_sandbox_client_id',
        environment: 'sandbox',
        isConfigured: paypalClient.isConfigured(),
        currency: 'USD',
      },
    });
  }
}

export const paymentController = new PaymentController();
