import { Product } from './product.js';

export type AgentStepType =
  | 'intent_decomposition'
  | 'channel3_query'
  | 'spec_evaluation'
  | 'budget_optimization'
  | 'cart_assembly'
  | 'payment_preparation';

export interface AgentStepTrace {
  id: string;
  stepNumber: number;
  type: AgentStepType;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
  durationMs: number;
  toolDetails?: {
    toolName: string;
    source: 'Channel3 100M+ Product Graph' | 'PayPilot Grounded Engine' | 'PayPal Sandbox REST v2';
    inputQuery?: string;
    matchedCount?: number;
    notes?: string;
  };
}

export interface AutonomousAgentPlan {
  planId: string;
  userGoal: string;
  targetBudgetUsd: number;
  isStrictBudget: boolean;
  categories: string[];
  traces: AgentStepTrace[];
  selectedProducts: Product[];
  bundleSubtotalUsd: number;
  bundleTaxUsd: number;
  bundleShippingUsd: number;
  bundleTotalUsd: number;
  remainingCapitalUsd: number;
  budgetUtilizationPercent: number;
  agentExecutiveSummary: string;
  isReadyForPayment: boolean;
  preStagedCartItems: Array<{
    productId: string;
    product: Product;
    quantity: number;
  }>;
  channel3LiveCount?: number;
  dataSource: 'Channel3 Live 100M+ Inventory' | 'Channel3 Verified Simulation';
}

export interface AutonomousAgentRequest {
  goal: string;
  targetBudgetUsd?: number;
  currency?: 'USD' | 'INR';
}

