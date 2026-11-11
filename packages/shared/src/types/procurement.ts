export type DeliveryPriority = 'cheapest' | 'balanced' | 'fastest';
export type BundleTierType = 'best_value' | 'max_performance' | 'fastest_dispatch';
export type PolicyZone = 'GREEN' | 'YELLOW' | 'RED';
export type SniperRuleStatus = 'ARMED' | 'PRICE_MATCHED' | 'EXECUTING' | 'EXECUTED' | 'CANCELLED';

export interface RequiredCategoryConstraint {
  categoryName: string;
  quantity: number;
  allocatedSubBudgetUsd: number;
  mustHaveSpecs: string[];
  preferredBrands: string[];
}

export interface DecomposedMissionIntent {
  missionTitle: string;
  hardBudgetMax: number;
  allocatedBufferUsd: number;
  netProcurementBudgetUsd: number;
  deliveryPriority: DeliveryPriority;
  requiredCategories: RequiredCategoryConstraint[];
  sourcePrompt?: string;
  sourceType: 'text' | 'vision' | 'refined';
  timestamp: string;
}

export interface MultiMerchantSKU {
  skuId: string;
  title: string;
  category: string;
  merchantName: string;
  merchantDomain: string;
  price: number;
  retailAvgPrice: number;
  arbitrageSavings: number;
  shippingCost: number;
  stockStatus: 'in_stock' | 'low_stock' | 'backorder';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  specs: Record<string, string | number | boolean>;
  aiValueScore: number;
  compatibilityTags: string[];
  isLocked?: boolean;
}

export interface ProcurementBundle {
  tier: BundleTierType;
  label: string;
  tagline: string;
  items: MultiMerchantSKU[];
  subtotal: number;
  totalShipping: number;
  totalArbitrageSaved: number;
  totalCost: number;
  remainingMargin: number;
  budgetUtilizationPercent: number;
  compatibilityPassed: boolean;
  compatibilityNotes: string[];
}

export interface SpendPolicyConfig {
  maxAutoApproveLimit: number;
  hardTransactionCeiling: number;
  dailySpendVelocityCap: number;
  allowedCategories: string[];
  requireVerifiedMerchants: boolean;
}

export interface GuardrailEvaluation {
  zone: PolicyZone;
  cartTotal: number;
  maxAutoApproveLimit: number;
  hardTransactionCeiling: number;
  policyPassportHash: string;
  isAutonomousApproved: boolean;
  requiresHumanApproval: boolean;
  isBlocked: boolean;
  zoneReason: string;
  checkedCategories: string[];
  evaluatedAt: string;
}

export interface PriceSniperRule {
  ruleId: string;
  skuId: string;
  productTitle: string;
  merchantDomain: string;
  initialPrice: number;
  targetPrice: number;
  currentPrice: number;
  status: SniperRuleStatus;
  userEmail: string;
  spendPolicyHash: string;
  createdAt: string;
  triggeredAt?: string;
  executedOrderId?: string;
  executedCaptureId?: string;
}

export interface SplitInvoiceTeammate {
  email: string;
  name: string;
  percentage?: number;
  amountUsd?: number;
}

export interface SplitInvoiceRequest {
  orderId?: string;
  items: Array<{ name: string; unitPrice: number; quantity: number }>;
  totalAmountUsd: number;
  teammates: SplitInvoiceTeammate[];
  note?: string;
}

export interface SplitInvoiceItemResult {
  invoiceId: string;
  invoiceNumber: string;
  payerEmail: string;
  amountUsd: number;
  status: 'SENT' | 'PAID' | 'SCHEDULED';
  viewUrl: string;
}

export interface SplitInvoiceResponse {
  success: boolean;
  totalAmountUsd: number;
  splitCount: number;
  invoices: SplitInvoiceItemResult[];
  createdAt: string;
}

export interface AgentTerminalLog {
  id: string;
  timestamp: string;
  tag: 'Intent' | 'Channel3' | 'Knapsack' | 'Guardrail' | 'PayPal' | 'Sniper' | 'SLA';
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  payload?: unknown;
}

