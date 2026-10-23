import { Product } from './product.js';
import { ExtractedIntent } from './intent.js';

export type BudgetFitStatus = 'exact' | 'under-budget' | 'stretch' | 'over-budget' | 'no-budget-specified';

export interface MatchScoreBreakdown {
  overallScore: number; // 0 - 100
  budgetScore: number; // 0 - 100
  featureScore: number; // 0 - 100
  ratingScore: number; // 0 - 100
}

export interface ProductRecommendationItem {
  product: Product;
  matchScore: number; // 0 - 100
  breakdown: MatchScoreBreakdown;
  budgetStatus: BudgetFitStatus;
  budgetDifferenceUsd: number; // positive = saved/under, negative = exceeded/over
  whyItFits: string; // Grounded evidence citing specific specs
  tradeOffs: string; // Honest compromise explanation
  keyDifferentiator: string;
}

export interface ComparisonMatrixRow {
  attributeName: string;
  category: 'core' | 'specs' | 'pricing' | 'value';
  values: Record<string, string | number | boolean>; // productId -> formatted value
  winnerProductId?: string;
  note?: string;
}

export interface ComparisonResult {
  products: Product[];
  matrixRows: ComparisonMatrixRow[];
  summaryVerdict: string;
  bestValueId: string;
  bestOverallId: string;
  aiTradeOffAnalysis: string;
}

export interface ShoppingAssistantResponse {
  query: string;
  intent: ExtractedIntent;
  recommendations: ProductRecommendationItem[];
  alternatives: ProductRecommendationItem[];
  assistantMessage: string;
  clarifyingQuestions?: string[];
  isFallbackEngine: boolean;
  modelIdentifier: string;
  processingTimeMs: number;
}
