import { ProductCategory } from './product.js';

export type PriorityFactor =
  | 'price'
  | 'performance'
  | 'battery'
  | 'comfort'
  | 'durability'
  | 'aesthetics'
  | 'portability';

export interface TargetBudget {
  amount: number;
  currency: 'USD' | 'INR';
  normalizedAmountUsd: number;
  isStrict: boolean;
}

export interface ExtractedIntent {
  rawQuery: string;
  category?: ProductCategory | 'all';
  targetBudget?: TargetBudget;
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  preferredBrands: string[];
  primaryUseCase?: string;
  priorities: PriorityFactor[];
  missingInformationWarning?: string;
}
