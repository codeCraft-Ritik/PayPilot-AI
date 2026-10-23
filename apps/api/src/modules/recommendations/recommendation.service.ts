import {
  ShoppingQueryInput,
  ShoppingAssistantResponse,
  CompareProductsInput,
  ComparisonResult,
  ComparisonMatrixRow,
  Product,
} from '@paypilot/shared';
import { aiService } from '../ai/ai.service.js';
import { productService } from '../products/product.service.js';
import { deterministicRankingEngine } from './ranking.engine.js';

export class RecommendationService {
  public async processShoppingAssistantQuery(
    input: ShoppingQueryInput
  ): Promise<ShoppingAssistantResponse> {
    const startTime = Date.now();

    // 1. AI Intent Extraction
    const { intent, isFallback, providerName } = await aiService.parseShoppingIntent(
      input.query,
      {
        userBudget: input.userBudget,
        currency: input.budgetCurrency,
        preferredCategory: input.preferredCategory,
      }
    );

    // 2. Query Catalogue deterministically
    let candidates: Product[];
    if (intent.category && intent.category !== 'all') {
      candidates = productService.getProducts({ category: intent.category });
    } else {
      candidates = productService.getProducts();
    }

    // If query contains specific keywords, filter or re-rank candidate list
    if (candidates.length === 0) {
      candidates = productService.getProducts(); // Fallback to full catalogue if category is too narrow
    }

    // 3. Generate grounded explanations from AI
    const explanations = await aiService.explainProductMatches(intent, candidates);

    // 4. Deterministic Ranking
    const { recommendations, alternatives } = deterministicRankingEngine.rankProducts(
      candidates,
      intent,
      explanations
    );

    // 5. Compose assistant summary message
    const categoryLabel = intent.category && intent.category !== 'all' ? intent.category : 'curated products';
    const budgetText = intent.targetBudget
      ? `within your ${intent.targetBudget.currency === 'INR' ? '₹' : '$'}${intent.targetBudget.amount.toLocaleString()} budget`
      : 'optimized for your requirements';

    const topProduct = recommendations[0]?.product;
    const assistantMessage = topProduct
      ? `Based on your request, I identified ${recommendations.length} standout options in ${categoryLabel} ${budgetText}. The **${topProduct.name}** stands out as the highest-scoring recommendation (${recommendations[0].matchScore}% match) because ${topProduct.highlightedFeature.toLowerCase()}.`
      : `I reviewed our catalogue for "${input.query}", but could not find an exact match within current inventory. Here are the closest alternatives.`;

    const clarifyingQuestions: string[] = [];
    if (!intent.targetBudget) {
      clarifyingQuestions.push('Do you have a preferred maximum price ceiling?');
    }
    if (intent.mustHaveFeatures.length === 0) {
      clarifyingQuestions.push('Are there specific connectivity or hardware features you need (e.g. wireless, battery life, dimensions)?');
    }

    return {
      query: input.query,
      intent,
      recommendations,
      alternatives,
      assistantMessage,
      clarifyingQuestions: clarifyingQuestions.length > 0 ? clarifyingQuestions : undefined,
      isFallbackEngine: isFallback,
      modelIdentifier: providerName,
      processingTimeMs: Date.now() - startTime,
    };
  }

  public async compareProducts(input: CompareProductsInput): Promise<ComparisonResult> {
    const products = productService.getProductsByIds(input.productIds);

    if (products.length < 2) {
      throw new Error('At least 2 valid products are required for comparison');
    }

    // Build structured comparison matrix rows
    const matrixRows: ComparisonMatrixRow[] = [
      {
        attributeName: 'Price (USD / INR)',
        category: 'pricing',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = `$${p.price.toFixed(2)} (₹${p.priceInr.toLocaleString()})`;
          return acc;
        }, {}),
        winnerProductId: [...products].sort((a, b) => a.price - b.price)[0].id,
        note: 'Lowest upfront purchase price',
      },
      {
        attributeName: 'User Rating',
        category: 'core',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = `⭐ ${p.rating} / 5.0 (${p.reviewCount.toLocaleString()} reviews)`;
          return acc;
        }, {}),
        winnerProductId: [...products].sort((a, b) => b.rating - a.rating)[0].id,
      },
      {
        attributeName: 'Key Advantage',
        category: 'value',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.highlightedFeature;
          return acc;
        }, {}),
      },
      {
        attributeName: 'Top Strength',
        category: 'specs',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.pros[0] || 'High build quality';
          return acc;
        }, {}),
      },
      {
        attributeName: 'Main Trade-off',
        category: 'specs',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.cons[0] || 'Standard limitations';
          return acc;
        }, {}),
      },
      {
        attributeName: 'Availability',
        category: 'core',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.inStock ? `In Stock (${p.stockCount} units)` : 'Backorder';
          return acc;
        }, {}),
      },
    ];

    // Add category-specific technical specs if all products share category
    const sharedCategory = products.every((p) => p.category === products[0].category)
      ? products[0].category
      : null;

    if (sharedCategory === 'audio') {
      matrixRows.splice(2, 0, {
        attributeName: 'Battery Playtime',
        category: 'specs',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.specs.batteryHours ? `${p.specs.batteryHours} Hours` : 'N/A';
          return acc;
        }, {}),
        winnerProductId: [...products].sort(
          (a, b) => Number(b.specs.batteryHours || 0) - Number(a.specs.batteryHours || 0)
        )[0].id,
      });

      matrixRows.splice(3, 0, {
        attributeName: 'Active Noise Cancellation',
        category: 'specs',
        values: products.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.specs.activeNoiseCancellation ? 'Yes (ANC Supported)' : 'Passive Isolation Only';
          return acc;
        }, {}),
      });
    }

    // AI synthesis
    const aiAnalysis = await aiService.compareProducts(products);

    return {
      products,
      matrixRows,
      summaryVerdict: aiAnalysis.summaryVerdict,
      bestValueId: aiAnalysis.bestValueId,
      bestOverallId: aiAnalysis.bestOverallId,
      aiTradeOffAnalysis: aiAnalysis.aiTradeOffAnalysis,
    };
  }
}

export const recommendationService = new RecommendationService();
