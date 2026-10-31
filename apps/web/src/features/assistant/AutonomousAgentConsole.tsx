import React, { useState } from 'react';
import {
  Cpu,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Database,
  Lock,
  Loader2,
  Check,
} from 'lucide-react';
import { AutonomousAgentPlan } from '@paypilot/shared';
import { ProductCard } from '../../components/shared/ProductCard.js';

interface AutonomousAgentConsoleProps {
  plan: AutonomousAgentPlan | null;
  isLoading: boolean;
  onExecuteGoal: (goal: string) => void;
  onApproveAndPay: (plan: AutonomousAgentPlan) => void;
  formatPrice: (amount: number) => string;
}

export const AutonomousAgentConsole: React.FC<AutonomousAgentConsoleProps> = ({
  plan,
  isLoading,
  onExecuteGoal,
  onApproveAndPay,
  formatPrice,
}) => {
  const [customGoal, setCustomGoal] = useState('');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const demoPresets = [
    {
      title: 'Workstation Audio + Ergo Bundle',
      goal: 'Equip my desk with wireless ANC headphones and an ergonomic mouse under $300',
      budget: '$300 USD',
      icon: '🎧🖱️',
      tag: 'Best Demo',
    },
    {
      title: 'Dev Typing + Studio Audio',
      goal: 'Setup developer desk with mechanical keyboard and studio headphones under $350',
      budget: '$350 USD',
      icon: '⌨️🎧',
      tag: 'Developer',
    },
    {
      title: 'Solo ANC Powerhouse',
      goal: 'Find the absolute best active noise-cancelling headphones under $400 for travel and Zoom',
      budget: '$400 USD',
      icon: '✈️🎙️',
      tag: 'Single Item',
    },
  ];

  const handlePresetClick = (goal: string) => {
    setCustomGoal(goal);
    onExecuteGoal(goal);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoal.trim() || isLoading) return;
    onExecuteGoal(customGoal.trim());
  };

  return (
    <div className="space-y-6">
      {/* Agentic Track Header Banner */}
      <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/10 via-surface to-accent/5 p-4 sm:p-5 shadow-tactile flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-xs">
              AGENTIC COMMERCE TRACK ($5,000)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-mono text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>CHANNEL3 100M+ GRAPH ($1,500)</span>
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Autonomous Multi-Step Commerce Agent
          </h2>
          <p className="text-xs text-foreground-muted max-w-xl">
            Give the agent a complex budget objective. It autonomously searches Channel3, optimizes bundle knapsack constraints, validates financial totals, and stages an official PayPal Sandbox checkout.
          </p>
        </div>

        {/* Live Channel3 Metric */}
        <div className="px-3.5 py-2 rounded-xl border border-border/80 bg-surface/90 text-right shrink-0 backdrop-blur-xs shadow-xs">
          <div className="text-[10px] font-mono text-foreground-muted uppercase tracking-wider">
            Connected Inventory
          </div>
          <div className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 justify-end">
            <Database className="w-3.5 h-3.5 text-accent" />
            <span>100,000,000+ Items</span>
          </div>
        </div>
      </div>

      {/* Preset Action Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-foreground-muted">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            ⚡ Instant Demonstration Missions:
          </span>
          <span className="text-[10px]">1-Click Multi-Step Execution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demoPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetClick(preset.goal)}
              className="p-3.5 rounded-xl border border-border bg-surface hover:border-accent hover:shadow-tactile transition-all text-left space-y-2 group active:scale-98 disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{preset.icon}</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-subtle text-[9px] font-mono font-bold text-foreground-muted group-hover:text-accent">
                  {preset.tag}
                </span>
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground group-hover:text-accent transition-colors line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[11px] font-mono text-foreground-muted mt-0.5">
                  Ceiling: {preset.budget}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Mission Form */}
      <form onSubmit={handleCustomSubmit} className="relative">
        <div className="relative rounded-2xl border-2 border-border/90 focus-within:border-accent bg-surface shadow-tactile transition-all">
          <div className="flex items-center p-2 sm:p-2.5 gap-2">
            <Cpu className="w-4 h-4 text-accent shrink-0 ml-2 animate-pulse" />
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="e.g. Equip my workspace with wireless headphones and an ergonomic mouse under $300..."
              disabled={isLoading}
              className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customGoal.trim() || isLoading}
              className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover disabled:bg-surface-subtle disabled:text-foreground-muted text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-tactile"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Agent Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading Live State */}
      {isLoading && (
        <div className="rounded-2xl border border-accent/40 bg-surface/90 p-8 text-center space-y-4 shadow-tactile-lg">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground">
              Autonomous Agent Loop in Progress
            </h3>
            <p className="text-xs text-foreground-muted font-mono">
              Analyzing constraints • Querying Channel3 100M+ real listings • Solving Knapsack budget optimization...
            </p>
          </div>
        </div>
      )}

      {/* Agent Plan Results & Live Trace */}
      {plan && !isLoading && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="rounded-2xl border-2 border-accent/40 bg-surface p-5 sm:p-6 shadow-tactile-lg space-y-4 holo-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                <span className="font-mono text-xs font-bold text-foreground">
                  PLAN ID: {plan.planId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono text-[10px] font-bold">
                  {plan.dataSource}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-foreground-muted">Target Allocation:</span>
                <span className="font-bold text-foreground">
                  {formatPrice(plan.targetBudgetUsd)}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {plan.agentExecutiveSummary}
            </p>

            {/* Financial Ledger Gauge */}
            <div className="p-4 rounded-xl border border-border bg-surface-subtle/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-foreground-muted">Budget Utilization:</span>
                <span className="font-bold text-foreground">
                  {formatPrice(plan.bundleTotalUsd)} / {formatPrice(plan.targetBudgetUsd)} ({plan.budgetUtilizationPercent}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${plan.budgetUtilizationPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-success font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Strict Knapsack Fit Verified</span>
                </span>
                <span className="text-success font-bold">
                  +{formatPrice(plan.remainingCapitalUsd)} Remaining Capital
                </span>
              </div>
            </div>

            {/* 1-Click PayPal Sandbox Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-foreground-muted">
                <Lock className="w-4 h-4 text-success" />
                <span>Zero Price Tampering • Line items verified on backend</span>
              </div>

              <button
                type="button"
                onClick={() => onApproveAndPay(plan)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-tactile transition-all active:scale-95 shadow-glow-subtle"
              >
                <CreditCard className="w-4 h-4" />
                <span>Approve Agent's Choice & Pay with PayPal ({formatPrice(plan.bundleTotalUsd)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Selected Optimized Bundle Products */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Agent's Shortlisted Bundle ({plan.selectedProducts.length} Items)</span>
              </h3>
              <span className="text-xs font-mono text-foreground-muted">
                Channel3 Live Graph Matches
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.selectedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Live Step-by-Step Autonomous Trace Terminal */}
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-tactile space-y-0">
            <div className="p-3.5 border-b border-border bg-surface-subtle flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <Cpu className="w-4 h-4 text-accent" />
                <span>Agent Execution Reasoning Trace (6 Phases)</span>
              </div>
              <span className="text-[10px] font-mono text-foreground-muted">
                Transparent Agent Audit Log
              </span>
            </div>

            <div className="divide-y divide-border/70">
              {plan.traces.map((trace) => {
                const isExpanded = expandedTraceId === trace.id;
                return (
                  <div key={trace.id} className="p-3.5 text-xs space-y-2 hover:bg-surface-subtle/40 transition-colors">
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => setExpandedTraceId(isExpanded ? null : trace.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          {trace.stepNumber}
                        </span>
                        <div className="font-semibold text-foreground">{trace.title}</div>
                      </div>

                      <div className="flex items-center gap-2 text-foreground-muted font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{trace.durationMs}ms</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <p className="text-foreground-muted pl-7.5 leading-relaxed">
                      {trace.description}
                    </p>

                    {/* Expandable Tool Inspector */}
                    {isExpanded && trace.toolDetails && (
                      <div className="ml-7.5 mt-2 p-3 rounded-lg border border-border/80 bg-surface font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-accent font-semibold border-b border-border/60 pb-1">
                          <span>Tool: {trace.toolDetails.toolName}</span>
                          <span>Source: {trace.toolDetails.source}</span>
                        </div>
                        {trace.toolDetails.inputQuery && (
                          <div className="text-foreground-muted">
                            Query: <span className="text-foreground">{trace.toolDetails.inputQuery}</span>
                          </div>
                        )}
                        {trace.toolDetails.matchedCount !== undefined && (
                          <div className="text-foreground-muted">
                            Matches: <span className="text-foreground font-bold">{trace.toolDetails.matchedCount}</span>
                          </div>
                        )}
                        {trace.toolDetails.notes && (
                          <div className="text-foreground-muted">
                            Notes: <span className="text-foreground">{trace.toolDetails.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
