import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Database,
  Cpu,
  Check,
  CreditCard,
  Lock,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Headphones,
  Keyboard,
  Radio,
  LucideIcon,
} from 'lucide-react';
import { AutonomousAgentPlan } from '@paypilot/shared';
import { ProductCard } from '../../components/shared/ProductCard.js';

interface AutonomousAgentConsoleProps {
  isLoading: boolean;
  plan: AutonomousAgentPlan | null;
  onExecuteGoal: (goal: string) => void;
  onApproveAndPay: (plan: AutonomousAgentPlan) => void;
  formatPrice: (amount: number) => string;
}

export const AutonomousAgentConsole: React.FC<AutonomousAgentConsoleProps> = ({
  isLoading,
  plan,
  onExecuteGoal,
  onApproveAndPay,
  formatPrice,
}) => {
  const [customGoal, setCustomGoal] = useState('');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || plan) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, plan]);

  const demoPresets: {
    title: string;
    goal: string;
    budget: string;
    icon: LucideIcon;
    tag: string;
  }[] = [
    {
      title: 'Workstation Audio + Ergo Bundle',
      goal: 'Equip my desk with wireless ANC headphones and an ergonomic mouse under $300',
      budget: '$300 USD',
      icon: Headphones,
      tag: 'Best Demo',
    },
    {
      title: 'Dev Typing + Studio Audio',
      goal: 'Setup developer desk with mechanical keyboard and studio headphones under $350',
      budget: '$350 USD',
      icon: Keyboard,
      tag: 'Developer',
    },
    {
      title: 'Solo ANC Powerhouse',
      goal: 'Find the absolute best active noise-cancelling headphones under $400 for travel and Zoom',
      budget: '$400 USD',
      icon: Radio,
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
      <div className="rounded-2xl border border-accent/30 bg-surface p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent text-white text-xs font-medium">
              Agentic commerce track ($5,000)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Channel3 100M+ graph</span>
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Autonomous multi-step commerce agent
          </h2>
          <p className="text-xs text-foreground-muted max-w-xl">
            Give the agent a complex budget objective. It autonomously searches Channel3, optimizes bundle knapsack constraints, validates financial totals, and stages an official PayPal Sandbox checkout.
          </p>
        </div>

        {/* Live Channel3 Metric */}
        <div className="px-3.5 py-2 rounded-xl border border-border/80 bg-surface-subtle text-right shrink-0 shadow-xs">
          <div className="text-[11px] text-foreground-muted font-medium">
            Connected inventory
          </div>
          <div className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 justify-end">
            <Database className="w-3.5 h-3.5 text-accent" />
            <span>100,000,000+ items</span>
          </div>
        </div>
      </div>

      {/* Preset Action Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span className="font-semibold text-foreground">
            Demonstration missions:
          </span>
          <span className="text-[11px]">1-Click multi-step execution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demoPresets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handlePresetClick(preset.goal)}
                className="p-3.5 rounded-xl border border-border bg-surface hover:border-accent hover:shadow-xs transition-colors duration-150 text-left space-y-2 group active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle text-[10px] font-medium text-foreground-muted group-hover:text-accent">
                    {preset.tag}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-xs text-foreground group-hover:text-accent transition-colors duration-150 line-clamp-1">
                    {preset.title}
                  </div>
                  <div className="text-xs text-foreground-muted mt-0.5 font-mono tabular-nums">
                    Ceiling: {preset.budget}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Mission Form */}
      <form onSubmit={handleCustomSubmit} className="relative">
        <div className="relative rounded-2xl border border-border/90 focus-within:border-accent bg-surface shadow-xs transition-colors duration-150">
          <div className="flex items-center p-2 sm:p-2.5 gap-2">
            <Cpu className="w-4 h-4 text-accent shrink-0 ml-2" />
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="e.g. Equip my workspace with wireless headphones and an ergonomic mouse under $300…"
              disabled={isLoading}
              className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customGoal.trim() || isLoading}
              className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover disabled:bg-surface-subtle disabled:text-foreground-muted text-white text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 shrink-0 shadow-xs whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Agent reasoning…</span>
                </>
              ) : (
                <>
                  <span>Dispatch agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Results & Progress Container */}
      <div ref={resultsRef} className="scroll-mt-24 space-y-6">
        {/* Loading Live State */}
        {isLoading && (
          <div className="rounded-2xl border border-accent/40 bg-surface p-8 text-center space-y-4 shadow-sm">
            <div className="relative w-12 h-12 mx-auto">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-foreground">
                Autonomous agent loop in progress
              </h3>
              <p className="text-xs text-foreground-muted">
                Analyzing constraints, querying Channel3 catalog, and solving knapsack optimization…
              </p>
            </div>
          </div>
        )}

        {/* Agent Plan Results & Live Trace */}
        {plan && !isLoading && (
          <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="rounded-2xl border border-accent/40 bg-surface p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs font-semibold text-foreground">
                  Plan: {plan.planId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {plan.dataSource}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-foreground-muted">Target allocation:</span>
                <span className="font-semibold font-mono tabular-nums text-foreground">
                  {formatPrice(plan.targetBudgetUsd)}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {plan.agentExecutiveSummary}
            </p>

            <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-muted">Budget utilization:</span>
                <span className="font-semibold font-mono tabular-nums text-foreground">
                  {formatPrice(plan.bundleTotalUsd)} / {formatPrice(plan.targetBudgetUsd)} ({plan.budgetUtilizationPercent}%)
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${plan.budgetUtilizationPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Strict knapsack fit verified</span>
                </span>
                <span className="text-emerald-600 font-semibold font-mono tabular-nums">
                  +{formatPrice(plan.remainingCapitalUsd)} remaining capital
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero price tampering, server verified line items</span>
              </div>

              <button
                type="button"
                onClick={() => onApproveAndPay(plan)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors duration-150 active:scale-95 whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span>Approve and pay with PayPal ({formatPrice(plan.bundleTotalUsd)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Agent shortlisted bundle ({plan.selectedProducts.length} items)</span>
              </h3>
              <span className="text-xs text-foreground-muted">
                Channel3 live graph matches
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.selectedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs space-y-0">
            <div className="p-3.5 border-b border-border bg-surface-subtle flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Cpu className="w-4 h-4 text-accent" />
                <span>Agent execution reasoning trace (6 phases)</span>
              </div>
              <span className="text-xs text-foreground-muted">
                Transparent agent audit log
              </span>
            </div>

            <div className="divide-y divide-border/70">
              {plan.traces.map((trace) => {
                const isExpanded = expandedTraceId === trace.id;
                return (
                  <div key={trace.id} className="p-3.5 text-xs space-y-2 hover:bg-surface-subtle/40 transition-colors duration-150">
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => setExpandedTraceId(isExpanded ? null : trace.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono font-medium text-[10px] flex items-center justify-center shrink-0">
                          {trace.stepNumber}
                        </span>
                        <div className="font-semibold text-foreground">{trace.title}</div>
                      </div>

                      <div className="flex items-center gap-2 text-foreground-muted text-xs">
                        <span className="flex items-center gap-1 text-emerald-600 font-mono tabular-nums">
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
                      <div className="ml-7.5 mt-2 p-3 rounded-lg border border-border/80 bg-surface text-xs space-y-1">
                        <div className="flex items-center justify-between text-accent font-semibold border-b border-border/60 pb-1">
                          <span>Tool: {trace.toolDetails.toolName}</span>
                          <span>Source: {trace.toolDetails.source}</span>
                        </div>
                        {trace.toolDetails.inputQuery && (
                          <div className="text-foreground-muted">
                            Query: <span className="text-foreground font-mono">{trace.toolDetails.inputQuery}</span>
                          </div>
                        )}
                        {trace.toolDetails.matchedCount !== undefined && (
                          <div className="text-foreground-muted">
                            Matches: <span className="text-foreground font-mono font-semibold">{trace.toolDetails.matchedCount}</span>
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
    </div>
  );
};
