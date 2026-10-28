import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Product, ProductCategory, CATEGORIES } from '@paypilot/shared';
import { api } from '../../services/api.js';
import { ProductCard } from '../../components/shared/ProductCard.js';
import { AgGridComparison } from '../comparison/AgGridComparison.js';

export const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = (searchParams.get('category') as ProductCategory) || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(categoryParam);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [viewMode, setViewMode] = useState<'cards' | 'aggrid'>('cards');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load catalogue products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = products
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Curated Product Catalogue</h1>
            <span className="px-2 py-0.5 rounded bg-surface-subtle text-foreground-muted border border-border text-[11px] font-mono">
              SAMPLE INVENTORY • {products.length} ITEMS
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            Explicitly labelled demonstration products with realistic specifications, pricing, and verified attributes.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 rounded border border-border bg-surface-subtle text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === 'cards'
                ? 'bg-surface text-foreground font-semibold shadow-xs'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Product Cards
          </button>
          <button
            onClick={() => setViewMode('aggrid')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${
              viewMode === 'aggrid'
                ? 'bg-surface text-accent font-semibold shadow-xs'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <span>⚡ AG Grid Table</span>
          </button>
        </div>
      </div>

      {viewMode === 'aggrid' ? (
        <AgGridComparison
          products={filteredProducts}
          title="Full Catalogue AG Grid Explorer"
          subtitle="Explore all 20+ curated sample products with client-side sorting, column resizing, and text search powered by AG Grid (Hackathon Sponsor)"
        />
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter catalogue by keyword, brand or spec..."
                className="w-full pl-9 pr-3 py-2 rounded border border-border bg-surface text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 self-end md:self-auto text-xs font-mono">
              <span className="text-foreground-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2.5 rounded border border-border bg-surface text-foreground text-xs focus:outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-foreground text-surface font-semibold'
                  : 'border border-border bg-surface hover:bg-surface-subtle text-foreground-muted'
              }`}
            >
              All Categories
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-foreground text-surface font-semibold'
                    : 'border border-border bg-surface hover:bg-surface-subtle text-foreground-muted'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="p-16 text-center text-xs font-mono text-foreground-muted">
              Loading sample catalogue...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded border border-border bg-surface space-y-2">
              <p className="font-semibold text-sm text-foreground">No products found</p>
              <p className="text-xs text-foreground-muted">Try resetting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
