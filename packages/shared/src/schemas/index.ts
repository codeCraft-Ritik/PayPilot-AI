import { z } from 'zod';

export const ShoppingQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, { message: 'Shopping request must be at least 2 characters long' })
    .max(1000, { message: 'Shopping request exceeds 1000 characters limit' }),
  userBudget: z.number().positive().optional(),
  budgetCurrency: z.enum(['USD', 'INR']).default('USD'),
  preferredCategory: z
    .enum(['audio', 'peripherals', 'workstation', 'smart-home', 'wearables', 'coffee-living', 'cameras', 'all'])
    .optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});

export type ShoppingQueryInput = z.infer<typeof ShoppingQuerySchema>;

export const CreateCartOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        // Note: unitPrice is NOT trusted from client. Server will look up authoritative price!
      })
    )
    .min(1, { message: 'Cart cannot be empty' }),
  targetBudget: z.number().positive().optional(),
  currency: z.enum(['USD', 'INR']).default('USD'),
  idempotencyKey: z.string().uuid().optional(),
});

export type CreateCartOrderInput = z.infer<typeof CreateCartOrderSchema>;

export const CaptureOrderSchema = z.object({
  orderId: z.string().min(1, { message: 'Order ID is required' }),
  paypalOrderId: z.string().min(1, { message: 'PayPal Order ID is required' }),
});

export type CaptureOrderInput = z.infer<typeof CaptureOrderSchema>;

export const CompareProductsSchema = z.object({
  productIds: z
    .array(z.string().min(1))
    .min(2, { message: 'Select at least 2 products to compare' })
    .max(4, { message: 'Compare maximum 4 products at a time' }),
  queryContext: z.string().optional(),
});

export type CompareProductsInput = z.infer<typeof CompareProductsSchema>;

export const AIIntentExtractionSchema = z.object({
  category: z
    .enum(['audio', 'peripherals', 'workstation', 'smart-home', 'wearables', 'coffee-living', 'cameras', 'all'])
    .default('all'),
  budgetAmount: z.number().nullable().optional(),
  budgetCurrency: z.enum(['USD', 'INR']).default('USD'),
  isStrictBudget: z.boolean().default(false),
  mustHaveFeatures: z.array(z.string()).default([]),
  niceToHaveFeatures: z.array(z.string()).default([]),
  preferredBrands: z.array(z.string()).default([]),
  primaryUseCase: z.string().default('General everyday use'),
  priorities: z.array(z.string()).default([]),
  missingInformationWarning: z.string().optional(),
});

export type AIIntentExtractionOutput = z.infer<typeof AIIntentExtractionSchema>;

export const AIExplanationSchema = z.object({
  productId: z.string(),
  whyItFits: z.string(),
  tradeOffs: z.string(),
  keyDifferentiator: z.string(),
});
