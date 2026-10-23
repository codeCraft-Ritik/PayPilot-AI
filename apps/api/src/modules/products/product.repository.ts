import { Product, ProductCategory, ProductFilterOptions } from '@paypilot/shared';
import { SAMPLE_CATALOGUE } from './data/catalogue.js';

export interface IProductRepository {
  getAll(filter?: ProductFilterOptions): Product[];
  getById(id: string): Product | undefined;
  getByIds(ids: string[]): Product[];
  getByCategory(category: ProductCategory): Product[];
  search(query: string, maxBudgetUsd?: number): Product[];
}

export class ProductRepository implements IProductRepository {
  private catalogue: Product[];

  constructor(initialData: Product[] = SAMPLE_CATALOGUE) {
    this.catalogue = [...initialData];
  }

  public getAll(filter?: ProductFilterOptions): Product[] {
    if (!filter) return [...this.catalogue];

    return this.catalogue.filter((p) => {
      if (filter.category && filter.category !== 'all' && p.category !== filter.category) {
        return false;
      }
      if (filter.minPrice !== undefined && p.price < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice !== undefined && p.price > filter.maxPrice) {
        return false;
      }
      if (filter.minRating !== undefined && p.rating < filter.minRating) {
        return false;
      }
      if (filter.inStockOnly && !p.inStock) {
        return false;
      }
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }

  public getById(id: string): Product | undefined {
    return this.catalogue.find((p) => p.id === id);
  }

  public getByIds(ids: string[]): Product[] {
    const set = new Set(ids);
    return this.catalogue.filter((p) => set.has(p.id));
  }

  public getByCategory(category: ProductCategory): Product[] {
    return this.catalogue.filter((p) => p.category === category);
  }

  public search(query: string, maxBudgetUsd?: number): Product[] {
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter((w) => w.length > 2);

    return this.catalogue
      .filter((p) => {
        if (maxBudgetUsd && p.price > maxBudgetUsd * 1.25) {
          // Allow up to 25% stretch for intelligent comparisons, but filter out extreme over-budgets
          return false;
        }
        if (words.length === 0) return true;

        const hay = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
        return words.some((w) => hay.includes(w));
      })
      .sort((a, b) => b.rating - a.rating);
  }
}

export const productRepository = new ProductRepository();
