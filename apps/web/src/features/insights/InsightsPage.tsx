import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Loader2,
  Layers,
} from 'lucide-react';
import { api, ShoppingInsightsData } from '../../services/api.js';
import { useApp } from '../../context/AppContext.js';

export const InsightsPage: React.FC = () => {
  const { formatPrice } = useApp();
  const [insights, setInsights] = useState<ShoppingInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInsights();
      setInsights(data);
    } catch (err) {
      console.error('Failed to load shopping insights', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
        <p className="text-xs text-foreground-muted">
          Computing transaction analytics from verified ledger…
        </p>
      </div>
    );
  }

  const categoryEntries = insights ? Object.entries(insights.categorySpending) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Shopping Insights & Analytics</h1>
            <span className="px-2 py-0.5 rounded bg-surface-subtle text-foreground-muted border border-border text-xs font-medium">
              Verified sandbox activity
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            Aggregated metrics calculated strictly from stored and verified PayPal sandbox transactions.
          </p>
        </div>

        <Link
          to="/workspace"
          className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-tactile active:scale-95"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted font-medium">
            <span>Completed purchases</span>
            <ShoppingBag className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
            {insights?.completedOrdersCount ?? 0}
          </div>
          <p className="text-xs text-foreground-muted">
            {insights?.totalItemsPurchased ?? 0} items purchased in total
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted font-medium">
            <span>Verified sandbox spend</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
            {formatPrice(insights?.totalSandboxSpendUsd ?? 0)}
          </div>
          <p className="text-xs text-foreground-muted">
            100% test currency (zero live impact)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted font-medium">
            <span>Average order value</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
            {formatPrice(insights?.averageOrderValueUsd ?? 0)}
          </div>
          <p className="text-xs text-foreground-muted">
            Based on completed checkouts
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted font-medium">
            <span>Gateway status</span>
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PayPal sandbox active</span>
          </div>
          <p className="text-xs text-foreground-muted">
            Idempotent server-verified API
          </p>
        </div>
      </div>

      {/* Category Breakdown & Recent Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Distribution (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-surface p-5 shadow-tactile space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span>Spend by Product Category</span>
            </h2>
            <span className="text-[11px] font-mono text-foreground-muted">
              {categoryEntries.length} categories
            </span>
          </div>

          {categoryEntries.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted space-y-1">
              <p>No transactions recorded yet.</p>
              <p className="text-[11px]">Completed test orders will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryEntries.map(([cat, amount]) => {
                const total = insights?.totalSandboxSpendUsd || 1;
                const pct = Math.round((amount / total) * 100);
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="capitalize text-foreground">{cat.replace('-', ' ')}</span>
                      <span className="text-foreground font-semibold">{formatPrice(amount)} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden border border-border/80">
                      <div
                        className="h-full bg-accent rounded-full transition-[width] duration-300 ease-out"
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders Ledger (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-surface p-5 shadow-tactile space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              <span>Verified Orders Ledger</span>
            </h2>
            <span className="text-[11px] font-mono text-foreground-muted">
              Latest transactions
            </span>
          </div>

          {(!insights?.recentOrders || insights.recentOrders.length === 0) ? (
            <div className="py-8 text-center text-xs text-foreground-muted space-y-1">
              <p>No recent orders found.</p>
              <p className="text-[11px]">Use the AI Copilot to select an item and complete a test checkout.</p>
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {insights.recentOrders.map((ord) => (
                <div key={ord.id} className="p-3 bg-surface hover:bg-surface-subtle/50 transition-colors flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">
                        {ord.orderNumber}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-success-subtle text-success border border-success-border">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-foreground-muted flex items-center gap-3">
                      <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{ord.itemsCount} {ord.itemsCount === 1 ? 'item' : 'items'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-foreground tabular-nums">
                      {formatPrice(ord.totalAmount)}
                    </span>
                    <Link
                      to={`/order/${ord.id}`}
                      className="p-1 rounded text-foreground-muted hover:text-accent transition-colors"
                      title="View verified receipt"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
