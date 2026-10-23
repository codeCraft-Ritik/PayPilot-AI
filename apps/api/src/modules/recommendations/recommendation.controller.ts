import { Request, Response, NextFunction } from 'express';
import { ShoppingQuerySchema, CompareProductsSchema } from '@paypilot/shared';
import { recommendationService } from './recommendation.service.js';

export class RecommendationController {
  public async assistantQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = ShoppingQuerySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid shopping query input',
          details: parsed.error.format(),
        });
        return;
      }

      const response = await recommendationService.processShoppingAssistantQuery(parsed.data);
      res.json({
        success: true,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public async compare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CompareProductsSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid comparison parameters',
          details: parsed.error.format(),
        });
        return;
      }

      const comparison = await recommendationService.compareProducts(parsed.data);
      res.json({
        success: true,
        data: comparison,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const recommendationController = new RecommendationController();
