import { ExtractedIntent, Product, ComparisonResult } from '@paypilot/shared';

export interface ProductExplanationPayload {
  whyItFits: string;
  tradeOffs: string;
  keyDifferentiator: string;
}

export interface IAIProvider {
  getProviderName(): string;
  isAvailable(): boolean;

  extractIntent(
    query: string,
    context?: {
      userBudget?: number;
      currency?: 'USD' | 'INR';
      preferredCategory?: string;
    }
  ): Promise<ExtractedIntent>;

  generateExplanations(
    intent: ExtractedIntent,
    products: Product[]
  ): Promise<Record<string, ProductExplanationPayload>>;

  generateComparisonAnalysis(
    products: Product[],
    intent?: ExtractedIntent
  ): Promise<{
    summaryVerdict: string;
    bestValueId: string;
    bestOverallId: string;
    aiTradeOffAnalysis: string;
  }>;
}
