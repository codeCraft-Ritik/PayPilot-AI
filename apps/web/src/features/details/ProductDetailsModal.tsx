import React from 'react';
import {
  X,
  Star,
  Plus,
  Scale,
  Sparkles,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { BudgetBar } from '../../components/shared/BudgetBar.js';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    formatPrice,
    addToCart,
    toggleCompare,
    isInComparison,
    userBudgetUsd,
    cart,
  } = useApp();

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const isCompared = isInComparison(product.id);
  const isInCart = cart.some((it) => it.productId === product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedProductForDetail(null)}
      />

      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-surface shadow-tactile-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-[11px] font-mono font-semibold uppercase text-foreground">
              {product.brand}
            </span>
            <span className="text-xs font-mono text-foreground-muted">
              ID: {product.id}
            </span>
          </div>
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="p-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Grid: Image + Main Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square rounded-lg border border-border bg-surface-subtle overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-foreground font-mono mb-1">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-foreground-muted">
                    ({product.reviewCount.toLocaleString()} verified catalogue reviews)
                  </span>
                </div>
                <h1 className="text-lg font-bold text-foreground leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="p-3 rounded-lg border border-border bg-surface-subtle space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-mono text-success flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>In Stock ({product.stockCount} available)</span>
                  </span>
                </div>

                {userBudgetUsd && (
                  <BudgetBar
                    currentAmountUsd={product.price}
                    targetBudgetUsd={userBudgetUsd}
                    label="Price vs Target Budget"
                    showDetails={false}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 py-2.5 rounded bg-accent hover:bg-accent-hover text-white text-xs font-medium flex items-center justify-center gap-2 shadow-tactile transition-colors active:scale-95"
                >
                  {isInCart ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`px-3 py-2.5 rounded border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isCompared
                      ? 'bg-foreground text-surface border-foreground'
                      : 'border-border bg-surface hover:bg-surface-subtle text-foreground'
                  }`}
                  title="Compare with other products"
                >
                  <Scale className="w-4 h-4" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Grounded Highlights */}
          <div className="p-4 rounded-lg border border-accent-border bg-accent-subtle/40 space-y-3">
            <div className="flex items-center gap-2 font-medium text-xs text-accent">
              <Sparkles className="w-4 h-4" />
              <span>PayPilot Grounded AI Analysis</span>
            </div>
            <p className="text-xs font-medium text-foreground">
              {product.highlightedFeature}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase text-success block mb-1">
                  Verified Advantages
                </span>
                <ul className="space-y-1 text-foreground-muted">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-mono font-semibold uppercase text-warning block mb-1">
                  Trade-offs to Consider
                </span>
                <ul className="space-y-1 text-foreground-muted">
                  {product.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              Technical Specifications
            </h3>
            <div className="rounded border border-border overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-subtle'}
                    >
                      <td className="py-2 px-3 font-mono text-foreground-muted w-1/2 border-r border-border capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="py-2 px-3 font-medium text-foreground">
                        {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
