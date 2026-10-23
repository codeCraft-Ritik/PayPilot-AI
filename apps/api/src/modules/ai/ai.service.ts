import { ExtractedIntent, Product } from '@paypilot/shared';
import { IAIProvider, ProductExplanationPayload } from './ai.interface.js';
import { geminiProvider } from './gemini.provider.js';
import { deterministicFallbackProvider } from './fallback.provider.js';

export class AIService {
  private activeProvider: IAIProvider;

  constructor() {
    if (geminiProvider.isAvailable()) {
      this.activeProvider = geminiProvider;
    } else {
      this.activeProvider = deterministicFallbackProvider;
    }
  }

  public getActiveProvider(): IAIProvider {
    return this.activeProvider;
  }

  public isUsingFallback(): boolean {
    return this.activeProvider === deterministicFallbackProvider;
  }

  public async parseShoppingIntent(
    query: string,
    context?: {
      userBudget?: number;
      currency?: 'USD' | 'INR';
      preferredCategory?: string;
    }
  ): Promise<{ intent: ExtractedIntent; isFallback: boolean; providerName: string }> {
    const intent = await this.activeProvider.extractIntent(query, context);
    return {
      intent,
      isFallback: this.isUsingFallback(),
      providerName: this.activeProvider.getProviderName(),
    };
  }

  public async explainProductMatches(
    intent: ExtractedIntent,
    products: Product[]
  ): Promise<Record<string, ProductExplanationPayload>> {
    return this.activeProvider.generateExplanations(intent, products);
  }

  public async compareProducts(
    products: Product[],
    intent?: ExtractedIntent
  ) {
    return this.activeProvider.generateComparisonAnalysis(products, intent);
  }
}

export const aiService = new AIService();
