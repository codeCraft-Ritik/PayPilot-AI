import { Request, Response, NextFunction } from 'express';
import { insightsService } from './insights.service.js';

export class InsightsController {
  public getInsights(_req: Request, res: Response, next: NextFunction): void {
    try {
      const insights = insightsService.getInsights();
      res.json({
        success: true,
        data: insights,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const insightsController = new InsightsController();
