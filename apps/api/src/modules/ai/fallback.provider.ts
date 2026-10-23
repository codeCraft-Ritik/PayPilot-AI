import {
  ExtractedIntent,
  Product,
  ProductCategory,
  PriorityFactor,
  convertCurrency,
} from '@paypilot/shared';
import { IAIProvider, ProductExplanationPayload } from './ai.interface.js';

export class DeterministicFallbackAIProvider implements IAIProvider {
  public getProviderName(): string {
    return 'PayPilot Deterministic Heuristic Engine v1.0 (Demo Mode)';
  }

  public isAvailable(): boolean {
    return true; // Always available without internet or API keys
  }

  public async extractIntent(
    query: string,
    context?: {
      userBudget?: number;
      currency?: 'USD' | 'INR';
      preferredCategory?: string;
    }
  ): Promise<ExtractedIntent> {
    const q = query.toLowerCase();

    // 1. Detect category
    let category: ProductCategory | 'all' = 'all';
    if (context?.preferredCategory && context.preferredCategory !== 'all') {
      category = context.preferredCategory as ProductCategory;
    } else if (/headphone|earbud|earphone|audio|anc|sound|noise-cancell/i.test(q)) {
      category = 'audio';
    } else if (/keyboard|mouse|peripheral|switch|mechanical|typing/i.test(q)) {
      category = 'peripherals';
    } else if (/monitor|display|desk|screen|workstation|dock|lightbar|4k/i.test(q)) {
      category = 'workstation';
    } else if (/coffee|espresso|grinder|latte|brew|mug/i.test(q)) {
      category = 'coffee-living';
    } else if (/watch|smartwatch|fitness|tracker|running|gps/i.test(q)) {
      category = 'wearables';
    } else if (/camera|webcam|streaming|vlog|gimbal|4k60/i.test(q)) {
      category = 'cameras';
    } else if (/smart home|speaker|bulb|hue|lighting|alexa/i.test(q)) {
      category = 'smart-home';
    }

    // 2. Detect budget
    let budgetAmount: number | undefined = context?.userBudget;
    let budgetCurrency: 'USD' | 'INR' = context?.currency || 'USD';
    let isStrict = /under|max|budget of|within|less than|not more than|cap/i.test(q);

    // Look for patterns like "under ₹3000", "₹3,000", "$150", "under $200", "150 dollars", "3000 inr"
    const inrMatch = q.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i) || q.match(/([\d,]+)\s*(?:rs|rupees|inr)/i);
    const usdMatch = q.match(/(?:\$|usd)\s*([\d,]+)/i) || q.match(/([\d,]+)\s*(?:dollars|bucks|usd)/i);
    const genericUnderMatch = q.match(/(?:under|below|max(?:imum)?)\s*([\d,]+)/i);

    if (inrMatch) {
      const num = parseFloat(inrMatch[1].replace(/,/g, ''));
      if (!isNaN(num) && num > 0) {
        budgetAmount = num;
        budgetCurrency = 'INR';
      }
    } else if (usdMatch) {
      const num = parseFloat(usdMatch[1].replace(/,/g, ''));
      if (!isNaN(num) && num > 0) {
        budgetAmount = num;
        budgetCurrency = 'USD';
      }
    } else if (genericUnderMatch && !budgetAmount) {
      const num = parseFloat(genericUnderMatch[1].replace(/,/g, ''));
      if (!isNaN(num) && num > 0) {
        budgetAmount = num;
        // Default to USD if under 1000, otherwise if > 1000 assume INR unless specified
        budgetCurrency = num > 1000 ? 'INR' : 'USD';
      }
    }

    const normalizedUsd = budgetAmount
      ? convertCurrency(budgetAmount, budgetCurrency, 'USD')
      : undefined;

    // 3. Extract must-have & nice-to-have features
    const mustHaveFeatures: string[] = [];
    const niceToHaveFeatures: string[] = [];

    const featureCatalog: Record<string, string[]> = {
      anc: ['anc', 'noise cancelling', 'noise cancellation', 'quiet'],
      microphone: ['mic', 'microphone', 'zoom', 'calls', 'meetings'],
      battery: ['battery', 'long playtime', 'battery life', 'all day'],
      wireless: ['wireless', 'bluetooth', 'cable-free'],
      'hot-swap': ['hot swap', 'hot-swappable', 'custom switch'],
      '4k': ['4k', 'ultra hd', '2160p', 'high resolution'],
      'usb-c': ['usb-c', 'type-c', 'charging hub', '90w'],
      compact: ['compact', 'portable', 'travel', 'lightweight', 'small'],
      ergonomic: ['ergonomic', 'wrist', 'comfort', 'hand pain'],
      espresso: ['espresso', 'steam wand', 'latte art', 'milk frother'],
      amoled: ['amoled', 'bright screen', 'touchscreen'],
    };

    for (const [tag, keywords] of Object.entries(featureCatalog)) {
      if (keywords.some((kw) => q.includes(kw))) {
        mustHaveFeatures.push(tag);
      }
    }

    // 4. Extract Priorities
    const priorities: PriorityFactor[] = [];
    if (/cheap|afford|budget|value|bang for buck/i.test(q)) priorities.push('price');
    if (/battery|stamina|hours/i.test(q)) priorities.push('battery');
    if (/comfort|plush|light|wear all day/i.test(q)) priorities.push('comfort');
    if (/sound quality|performance|fast|speed|pro/i.test(q)) priorities.push('performance');
    if (/durable|aluminum|build quality|metal/i.test(q)) priorities.push('durability');
    if (/travel|portable|bag|pocket/i.test(q)) priorities.push('portability');

    // 5. Preferred Brands
    const brandNames = ['Sony', 'Bose', 'Anker', 'Keychron', 'Logitech', 'Dell', 'LG', 'Breville', 'Garmin', 'Fellow', 'Apple'];
    const preferredBrands = brandNames.filter((b) => q.includes(b.toLowerCase()));

    // 6. Check for missing information
    let missingInfo: string | undefined;
    if (!budgetAmount) {
      missingInfo = 'No budget cap specified. Showing optimal recommendations across all price tiers.';
    } else if (mustHaveFeatures.length === 0) {
      missingInfo = 'No specific technical specifications specified. Displaying best-rated items in this category.';
    }

    return {
      rawQuery: query,
      category,
      targetBudget: budgetAmount && normalizedUsd
        ? {
            amount: budgetAmount,
            currency: budgetCurrency,
            normalizedAmountUsd: normalizedUsd,
            isStrict,
          }
        : undefined,
      mustHaveFeatures,
      niceToHaveFeatures,
      preferredBrands,
      primaryUseCase: q.length > 10 ? query.slice(0, 80) : 'General everyday productivity & enjoyment',
      priorities: priorities.length > 0 ? priorities : ['price', 'performance'],
      missingInformationWarning: missingInfo,
    };
  }

  public async generateExplanations(
    intent: ExtractedIntent,
    products: Product[]
  ): Promise<Record<string, ProductExplanationPayload>> {
    const explanations: Record<string, ProductExplanationPayload> = {};

    for (const product of products) {
      const budgetNote = intent.targetBudget
        ? product.price <= intent.targetBudget.normalizedAmountUsd
          ? `Fits your $${intent.targetBudget.normalizedAmountUsd} budget with $${(
              intent.targetBudget.normalizedAmountUsd - product.price
            ).toFixed(2)} in savings.`
          : `Priced at $${product.price.toFixed(2)}, slightly above your $${
              intent.targetBudget.normalizedAmountUsd
            } target, but delivers premium performance.`
        : `Priced at $${product.price.toFixed(2)}.`;

      const matchedPros = product.pros.slice(0, 2).join('; ');
      const matchedCons = product.cons[0] || 'Requires initial configuration.';

      explanations[product.id] = {
        whyItFits: `${product.name} matches your focus: ${matchedPros}. ${budgetNote}`,
        tradeOffs: `Trade-off to consider: ${matchedCons}`,
        keyDifferentiator: product.highlightedFeature,
      };
    }

    return explanations;
  }

  public async generateComparisonAnalysis(
    products: Product[],
    _intent?: ExtractedIntent
  ): Promise<{
    summaryVerdict: string;
    bestValueId: string;
    bestOverallId: string;
    aiTradeOffAnalysis: string;
  }> {
    if (products.length === 0) {
      return {
        summaryVerdict: 'No products selected for comparison.',
        bestValueId: '',
        bestOverallId: '',
        aiTradeOffAnalysis: 'Select at least 2 products to compare.',
      };
    }

    // Best value: highest rating-to-price ratio
    const sortedByValue = [...products].sort((a, b) => b.rating / b.price - a.rating / a.price);
    const bestValue = sortedByValue[0];

    // Best overall: highest raw rating and features
    const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);
    const bestOverall = sortedByRating[0];

    const verdict =
      products.length >= 2
        ? `Between ${products[0].name} and ${products[1].name}, the ${bestValue.name} offers the strongest value-for-money, whereas ${bestOverall.name} takes the lead for absolute performance.`
        : `Analyzing ${products[0].name} against industry benchmarks.`;

    const tradeOffAnalysis = products
      .map(
        (p) =>
          `• **${p.name}** ($${p.price.toFixed(2)}): ${p.highlightedFeature}. Key compromise: ${p.cons[0] || 'None noted'}.`
      )
      .join('\n');

    return {
      summaryVerdict: verdict,
      bestValueId: bestValue.id,
      bestOverallId: bestOverall.id,
      aiTradeOffAnalysis: tradeOffAnalysis,
    };
  }
}

export const deterministicFallbackProvider = new DeterministicFallbackAIProvider();
