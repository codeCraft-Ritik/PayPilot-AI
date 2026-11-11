import React from 'react';
import {
  Star,
  Check,
  Plus,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { Product, ProductRecommendationItem } from '@paypilot/shared';
import { useApp } from '../../context/AppContext.js';

interface ProductCardProps {
  product: Product;
  recommendation?: ProductRecommendationItem | any;
  featured?: boolean;
  layout?: 'vertical' | 'horizontal' | 'standard';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  recommendation,
  featured = false,
  layout = 'vertical',
}) => {
  const {
    formatPrice,
    addToCart,
    toggleCompare,
    isInComparison,
    setSelectedProductForDetail,
    cart,
  } = useApp();

  const isCompared = isInComparison(product.id);
  const isInCart = cart.some((it) => it.productId === product.id);

  return (
    <div
      className={`group relative flex h-full ${
        layout === 'horizontal' ? 'flex-col sm:flex-row' : 'flex-col'
      } rounded-2xl border bg-surface transition-colors duration-150 overflow-hidden ${
        featured
          ? 'border-accent shadow-sm'
          : 'border-border/80 hover:border-foreground-muted/40 shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Top / Left Media Container */}
      <div
        className={`relative ${
          layout === 'horizontal'
            ? 'w-full sm:w-2/5 aspect-16/10 sm:aspect-auto shrink-0 min-h-[190px]'
            : 'w-full aspect-16/10'
        } bg-surface-subtle overflow-hidden cursor-pointer`}
        onClick={() => setSelectedProductForDetail(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md text-[11px] font-medium text-foreground border border-border/80 shadow-xs">
            {product.brand}
          </span>
          {featured && (
            <span className="px-2.5 py-0.5 rounded-full bg-accent text-white text-[11px] font-medium shadow-xs">
              Top pick
            </span>
          )}
          {product.isSampleData && (
            <span className="px-2 py-0.5 rounded-full bg-surface/90 text-[10px] text-foreground-muted border border-border/70">
              Sample spec
            </span>
          )}
        </div>

        {/* AI Match Score Badge */}
        {recommendation && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-xs font-medium shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>{recommendation.matchScore}% match</span>
          </div>
        )}

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-surface text-foreground text-xs font-medium shadow-sm flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-accent" />
            <span>View full specs</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        {/* Title, Category & Rating */}
        <div>
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
            <span className="capitalize text-xs font-medium">{product.category.replace('-', ' ')}</span>
            <div className="flex items-center gap-1 text-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-semibold font-mono text-xs">{product.rating}</span>
              <span className="text-foreground-muted">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => setSelectedProductForDetail(product)}
            className="font-medium text-foreground text-sm line-clamp-2 hover:text-accent cursor-pointer transition-colors duration-150 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Grounded AI Rationale Snippet (if available) */}
        {recommendation ? (
          <div className="p-2.5 rounded-lg bg-surface-subtle border border-border text-xs space-y-1.5">
            <div className="flex items-start gap-1.5 text-foreground leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>{recommendation.whyItFits}</span>
            </div>
            {recommendation.tradeOffs && (
              <div className="text-[11px] text-foreground-muted pl-5 border-t border-border/60 pt-1">
                <span className="font-semibold text-amber-700">Compromise:</span> {recommendation.tradeOffs}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
            {product.highlightedFeature}
          </p>
        )}

        {/* Price and Actions Row */}
        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
          {/* Price display */}
          <div className="flex flex-col">
            <span className="text-base font-bold font-mono text-foreground tracking-tight tabular-nums">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] text-foreground-muted">
              Authoritative catalog price
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Compare Toggle */}
            <button
              onClick={() => toggleCompare(product.id)}
              className={`p-2 rounded-xl border transition-colors duration-150 active:scale-95 ${
                isCompared
                  ? 'bg-accent text-white border-accent shadow-xs'
                  : 'border-border/80 bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare with other products'}
              aria-label="Compare"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product)}
              className="px-3.5 py-2 rounded-xl bg-foreground text-surface hover:bg-accent transition-colors duration-150 text-xs font-semibold flex items-center gap-1.5 active:scale-95 shadow-xs"
              aria-label="Add to cart"
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
