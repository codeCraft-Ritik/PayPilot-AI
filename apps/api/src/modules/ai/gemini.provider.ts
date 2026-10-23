import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedIntent, Product, ProductCategory, convertCurrency } from '@paypilot/shared';
import { env, isGeminiConfigured } from '../../config/env.js';
import { IAIProvider, ProductExplanationPayload } from './ai.interface.js';
import { deterministicFallbackProvider } from './fallback.provider.js';

export class GeminiAIProvider implements IAIProvider {
  private client: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    this.modelName = env.GEMINI_MODEL || 'gemini-2.5-flash';
    if (isGeminiConfigured && env.GEMINI_API_KEY) {
      try {
        this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      } catch (err) {
        console.warn('⚠️ Could not initialize Gemini client, falling back to deterministic engine:', err);
        this.client = null;
      }
    }
  }

  public getProviderName(): string {
    return `Google Gemini (${this.modelName})`;
  }

  public isAvailable(): boolean {
    return Boolean(this.client && isGeminiConfigured);
  }

  public async extractIntent(
    query: string,
    context?: {
      userBudget?: number;
      currency?: 'USD' | 'INR';
      preferredCategory?: string;
    }
  ): Promise<ExtractedIntent> {
    if (!this.client) {
      return deterministicFallbackProvider.extractIntent(query, context);
    }

    try {
      const prompt = `
You are PayPilot AI, an expert shopping intelligence copilot.
Analyze this user shopping query and extract their intent in structured JSON.

User Query: "${query.replace(/"/g, '\\"')}"
Explicit User Budget Context: ${context?.userBudget || 'None specified'} ${context?.currency || 'USD'}
Preferred Category: ${context?.preferredCategory || 'Auto-detect'}

Allowed Categories: ["audio", "peripherals", "workstation", "smart-home", "wearables", "coffee-living", "cameras", "all"]

Extract and return ONLY a valid JSON object matching this TypeScript interface:
{
  "category": "audio" | "peripherals" | "workstation" | "smart-home" | "wearables" | "coffee-living" | "cameras" | "all",
  "budgetAmount": number | null,
  "budgetCurrency": "USD" | "INR",
  "isStrictBudget": boolean,
  "mustHaveFeatures": string[],
  "niceToHaveFeatures": string[],
  "preferredBrands": string[],
  "primaryUseCase": string,
  "priorities": ("price" | "performance" | "battery" | "comfort" | "durability" | "aesthetics" | "portability")[],
  "missingInformationWarning": string | null
}
`;

      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text()?.trim() || '';
      const parsed = JSON.parse(text);

      const budgetAmount = parsed.budgetAmount ?? context?.userBudget;
      const budgetCurrency = (parsed.budgetCurrency as 'USD' | 'INR') || context?.currency || 'USD';
      const normalizedUsd = budgetAmount
        ? convertCurrency(budgetAmount, budgetCurrency, 'USD')
        : undefined;

      return {
        rawQuery: query,
        category: parsed.category as ProductCategory | 'all',
        targetBudget: budgetAmount && normalizedUsd
          ? {
              amount: budgetAmount,
              currency: budgetCurrency,
              normalizedAmountUsd: normalizedUsd,
              isStrict: Boolean(parsed.isStrictBudget),
            }
          : undefined,
        mustHaveFeatures: Array.isArray(parsed.mustHaveFeatures) ? parsed.mustHaveFeatures : [],
        niceToHaveFeatures: Array.isArray(parsed.niceToHaveFeatures) ? parsed.niceToHaveFeatures : [],
        preferredBrands: Array.isArray(parsed.preferredBrands) ? parsed.preferredBrands : [],
        primaryUseCase: parsed.primaryUseCase || 'General daily use',
        priorities: Array.isArray(parsed.priorities) ? parsed.priorities : ['price', 'performance'],
        missingInformationWarning: parsed.missingInformationWarning || undefined,
      };
    } catch (err) {
      console.warn('⚠️ Gemini intent extraction failed or timed out. Falling back to heuristic parser:', err);
      return deterministicFallbackProvider.extractIntent(query, context);
    }
  }

  public async generateExplanations(
    intent: ExtractedIntent,
    products: Product[]
  ): Promise<Record<string, ProductExplanationPayload>> {
    if (!this.client || products.length === 0) {
      return deterministicFallbackProvider.generateExplanations(intent, products);
    }

    try {
      const simplifiedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating,
        highlightedFeature: p.highlightedFeature,
        pros: p.pros,
        cons: p.cons,
        specs: p.specs,
      }));

      const prompt = `
You are PayPilot AI. Explain why the following catalogue products match the user's intent.
Ground your reasoning STRICTLY in the provided product specifications, pros, and cons. Do not invent facts.

User Intent:
Query: "${intent.rawQuery}"
Budget: ${intent.targetBudget ? `$${intent.targetBudget.normalizedAmountUsd}` : 'None'}
Must-haves: ${intent.mustHaveFeatures.join(', ')}

Products:
${JSON.stringify(simplifiedProducts, null, 2)}

Return ONLY a JSON map where each key is a productId and value is:
{
  "whyItFits": "Concise 1-2 sentence evidence citing real specs/pros explaining why it matches the query",
  "tradeOffs": "Honest 1 sentence trade-off or compromise based on cons",
  "keyDifferentiator": "Short punchy phrase summarizing its main advantage"
}
`;

      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text()?.trim() || '';
      return JSON.parse(text);
    } catch (err) {
      console.warn('⚠️ Gemini explanation generation failed. Using deterministic fallback explanations:', err);
      return deterministicFallbackProvider.generateExplanations(intent, products);
    }
  }

  public async generateComparisonAnalysis(
    products: Product[],
    intent?: ExtractedIntent
  ): Promise<{
    summaryVerdict: string;
    bestValueId: string;
    bestOverallId: string;
    aiTradeOffAnalysis: string;
  }> {
    if (!this.client || products.length < 2) {
      return deterministicFallbackProvider.generateComparisonAnalysis(products, intent);
    }

    try {
      const simplifiedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating,
        specs: p.specs,
        pros: p.pros,
        cons: p.cons,
      }));

      const prompt = `
Compare these products for an online shopper.
Provide an objective, evidence-based synthesis.

Products to compare:
${JSON.stringify(simplifiedProducts, null, 2)}

Return ONLY a JSON object:
{
  "summaryVerdict": "Direct 2-sentence executive summary comparing them",
  "bestValueId": "id of the best value for price",
  "bestOverallId": "id of the highest absolute capability/quality",
  "aiTradeOffAnalysis": "Markdown bulleted breakdown of the key trade-offs between them"
}
`;

      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text()?.trim() || '';
      return JSON.parse(text);
    } catch (err) {
      console.warn('⚠️ Gemini comparison synthesis failed. Using fallback:', err);
      return deterministicFallbackProvider.generateComparisonAnalysis(products, intent);
    }
  }
}

export const geminiProvider = new GeminiAIProvider();
