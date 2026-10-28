import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ComparisonResult } from '@paypilot/shared';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { AgGridComparison } from './AgGridComparison.js';

export const ComparisonView: React.FC = () => {
  const {
    comparedProductIds,
    toggleCompare,
    clearComparison,
    formatPrice,
    addToCart,
    cart,
  } = useApp();

  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editorial' | 'aggrid'>('editorial');

  useEffect(() => {
    if (comparedProductIds.length >= 2) {
      loadComparison();
    } else {
      setComparisonData(null);
    }
  }, [comparedProductIds]);

  const loadComparison = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.compareProducts({
        productIds: comparedProductIds,
      });
      setComparisonData(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to compare products');
    } finally {
      setIsLoading(false);
    }
  };

  if (comparedProductIds.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-surface-subtle border border-border flex items-center justify-center mx-auto text-foreground-muted">
          <Scale className="w-8 h-8 text-accent" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h1 className="text-xl font-bold text-foreground">Select At Least 2 Products</h1>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Click the <Scale className="inline w-3.5 h-3.5 text-accent mx-0.5" /> Compare button on any product card in the AI Workspace or Catalogue to view side-by-side spec trade-offs and AI verdicts.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-foreground text-surface text-xs font-semibold shadow-tactile hover:bg-accent transition-colors"
          >
            <span>Browse Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Side-by-Side Comparison</h1>
            <span className="px-2 py-0.5 rounded bg-surface-subtle text-foreground-muted border border-border text-[11px] font-mono">
              {comparedProductIds.length} PRODUCTS SELECTED
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            Objective specification cross-analysis with AI-generated trade-off verdict.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View mode toggle */}
          <div className="flex items-center p-0.5 rounded border border-border bg-surface-subtle text-xs font-mono">
            <button
              onClick={() => setViewMode('editorial')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'editorial'
                  ? 'bg-surface text-foreground font-semibold shadow-xs'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Editorial Matrix
            </button>
            <button
              onClick={() => setViewMode('aggrid')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                viewMode === 'aggrid'
                  ? 'bg-surface text-accent font-semibold shadow-xs'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <span>⚡ AG Grid</span>
            </button>
          </div>

          <button
            onClick={clearComparison}
            className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-subtle text-xs font-mono text-foreground-muted hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-xs font-mono text-foreground-muted">
            Generating side-by-side trade-off matrix...
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg border border-danger-border bg-danger-subtle text-xs text-danger flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {comparisonData && !isLoading && (
        <>
          {/* AI Executive Verdict */}
          <div className="rounded-xl border border-accent-border bg-accent-subtle/50 p-5 shadow-tactile space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-accent tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>PAYPILOT AI COMPARISON VERDICT</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {comparisonData.summaryVerdict}
            </p>

            {comparisonData.aiTradeOffAnalysis && (
              <div className="p-3 rounded bg-surface border border-border/80 text-xs text-foreground leading-relaxed whitespace-pre-line font-normal">
                {comparisonData.aiTradeOffAnalysis}
              </div>
            )}
          </div>

          {/* Side-by-Side Product Grid Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData.products.map((p) => {
              const isInCart = cart.some((it) => it.productId === p.id);
              const isBestValue = comparisonData.bestValueId === p.id;
              const isBestOverall = comparisonData.bestOverallId === p.id;

              return (
                <div
                  key={p.id}
                  className={`rounded-lg border bg-surface p-4 flex flex-col justify-between space-y-4 shadow-tactile ${
                    isBestOverall ? 'border-accent ring-1 ring-accent/20' : 'border-border'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-16/10 rounded overflow-hidden bg-surface-subtle border border-border">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      {isBestOverall && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-accent text-white font-mono text-[10px] font-bold">
                          BEST OVERALL
                        </span>
                      )}
                      {isBestValue && !isBestOverall && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-success text-white font-mono text-[10px] font-bold">
                          BEST VALUE
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-foreground-muted">
                        {p.brand}
                      </span>
                      <h3 className="text-xs font-semibold text-foreground line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-sm font-bold font-mono text-foreground mt-1 tabular-nums">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => addToCart(p)}
                      className="flex-1 py-2 rounded bg-foreground hover:bg-accent text-surface text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-tactile"
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="p-2 rounded border border-border hover:bg-surface-subtle text-foreground-muted"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conditional View: AG Grid vs Editorial Matrix */}
          {viewMode === 'aggrid' ? (
            <AgGridComparison
              products={comparisonData.products}
              title="Shortlisted Products AG Grid Matrix"
              subtitle="Live multi-column sorting, floating text filters, and direct cart actions powered by AG Grid Community v36"
            />
          ) : (
            /* Detailed Matrix Table */
            <div className="rounded-xl border border-border bg-surface shadow-tactile overflow-hidden">
              <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                  ATTRIBUTE SPECIFICATION MATRIX
                </span>
                <span className="text-[11px] font-mono text-foreground-muted">
                  Green badges indicate spec winners
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle">
                      <th className="p-3 font-mono text-foreground-muted w-1/4">Specification</th>
                      {comparisonData.products.map((p) => (
                        <th key={p.id} className="p-3 font-semibold text-foreground">
                          {p.brand} {p.name.split(' ').slice(0, 3).join(' ')}...
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {comparisonData.matrixRows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-subtle/30'}>
                        <td className="p-3 font-medium text-foreground w-1/4">
                          <span className="capitalize">{row.attributeName}</span>
                          {row.note && (
                            <span className="block text-[10px] text-foreground-muted font-normal mt-0.5">
                              {row.note}
                            </span>
                          )}
                        </td>
                        {comparisonData.products.map((p) => {
                          const val = row.values[p.id];
                          const isWinner = row.winnerProductId === p.id;
                          return (
                            <td key={p.id} className="p-3 font-mono text-foreground">
                              <span
                                className={
                                  isWinner
                                    ? 'px-2 py-0.5 rounded bg-success-subtle text-success border border-success-border font-semibold'
                                    : ''
                                }
                              >
                                {val !== undefined ? val.toString() : '—'}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
