import {
  Product,
  ExtractedIntent,
  ProductRecommendationItem,
  BudgetFitStatus,
} from '@paypilot/shared';
import { ProductExplanationPayload } from '../ai/ai.interface.js';

export class DeterministicRankingEngine {
  public rankProducts(
    products: Product[],
    intent: ExtractedIntent,
    explanations: Record<string, ProductExplanationPayload>
  ): {
    recommendations: ProductRecommendationItem[];
    alternatives: ProductRecommendationItem[];
  } {
    const scoredItems: ProductRecommendationItem[] = products.map((product) => {
      const budgetAnalysis = this.calculateBudgetScore(product, intent);
      const featureScore = this.calculateFeatureScore(product, intent);
      const ratingScore = Math.round((product.rating / 5.0) * 100);

      // Weighted overall calculation
      // If budget was specified, budget carries 40% weight; otherwise feature carries 70% weight
      const hasBudget = Boolean(intent.targetBudget);
      const overallScore = hasBudget
        ? Math.round(budgetAnalysis.score * 0.4 + featureScore * 0.4 + ratingScore * 0.2)
        : Math.round(featureScore * 0.65 + ratingScore * 0.35);

      const exp = explanations[product.id] || {
        whyItFits: `${product.name} offers strong ratings (${product.rating}/5) and ${product.highlightedFeature}.`,
        tradeOffs: product.cons[0] ? `Note: ${product.cons[0]}` : 'Standard trade-offs for this tier.',
        keyDifferentiator: product.highlightedFeature,
      };

      return {
        product,
        matchScore: Math.min(99, Math.max(30, overallScore)),
        breakdown: {
          overallScore: Math.min(99, Math.max(30, overallScore)),
          budgetScore: budgetAnalysis.score,
          featureScore,
          ratingScore,
        },
        budgetStatus: budgetAnalysis.status,
        budgetDifferenceUsd: budgetAnalysis.differenceUsd,
        whyItFits: exp.whyItFits,
        tradeOffs: exp.tradeOffs,
        keyDifferentiator: exp.keyDifferentiator,
      };
    });

    // Sort descending by matchScore
    scoredItems.sort((a, b) => b.matchScore - a.matchScore);

    // Split into top recommendations (within budget or top 3) and alternatives (stretch/over-budget options)
    const withinBudgetOrTop = scoredItems.filter(
      (item) => item.budgetStatus !== 'over-budget'
    );
    const overBudgetItems = scoredItems.filter(
      (item) => item.budgetStatus === 'over-budget' || item.budgetStatus === 'stretch'
    );

    let recommendations: ProductRecommendationItem[];
    let alternatives: ProductRecommendationItem[];

    if (withinBudgetOrTop.length >= 2) {
      recommendations = withinBudgetOrTop.slice(0, 3);
      alternatives = scoredItems
        .filter((item) => !recommendations.some((r) => r.product.id === item.product.id))
        .slice(0, 2);
    } else {
      recommendations = scoredItems.slice(0, 3);
      alternatives = scoredItems.slice(3, 5);
    }

    return { recommendations, alternatives };
  }

  private calculateBudgetScore(
    product: Product,
    intent: ExtractedIntent
  ): {
    score: number;
    status: BudgetFitStatus;
    differenceUsd: number;
  } {
    if (!intent.targetBudget) {
      return {
        score: 90,
        status: 'no-budget-specified',
        differenceUsd: 0,
      };
    }

    const budget = intent.targetBudget.normalizedAmountUsd;
    const diff = budget - product.price; // positive = under budget, negative = over budget

    if (Math.abs(diff) < 2) {
      return { score: 100, status: 'exact', differenceUsd: diff };
    }

    if (diff > 0) {
      // Under budget: ideal!
      const savingsRatio = diff / budget;
      // If saving up to 50%, high score. If saving 80%, might be much cheaper/lower tier
      const score = savingsRatio > 0.6 ? 85 : 98;
      return { score, status: 'under-budget', differenceUsd: diff };
    }

    // Over budget
    const overrunRatio = Math.abs(diff) / budget;
    if (overrunRatio <= 0.15) {
      // Within 15% stretch
      return {
        score: Math.max(65, Math.round(90 - overrunRatio * 150)),
        status: 'stretch',
        differenceUsd: diff,
      };
    }

    // Substantially over budget
    return {
      score: Math.max(25, Math.round(60 - overrunRatio * 80)),
      status: 'over-budget',
      differenceUsd: diff,
    };
  }

  private calculateFeatureScore(product: Product, intent: ExtractedIntent): number {
    let score = 70; // baseline

    // Must have features match
    if (intent.mustHaveFeatures.length > 0) {
      const productHaystack = `${product.name} ${product.description} ${product.tags.join(' ')} ${JSON.stringify(
        product.specs
      )}`.toLowerCase();

      let matchedCount = 0;
      for (const feat of intent.mustHaveFeatures) {
        if (productHaystack.includes(feat.toLowerCase())) {
          matchedCount++;
        }
      }

      const matchRatio = matchedCount / intent.mustHaveFeatures.length;
      score = Math.round(50 + matchRatio * 45);
    }

    // Preferred brand bonus
    if (intent.preferredBrands.length > 0) {
      const brandMatch = intent.preferredBrands.some(
        (b) => b.toLowerCase() === product.brand.toLowerCase()
      );
      if (brandMatch) score += 5;
    }

    return Math.min(100, Math.max(30, score));
  }
}

export const deterministicRankingEngine = new DeterministicRankingEngine();
