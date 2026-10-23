export type ProductCategory =
  | 'audio'
  | 'peripherals'
  | 'workstation'
  | 'smart-home'
  | 'wearables'
  | 'coffee-living'
  | 'cameras';

export interface ProductSpecValue {
  label: string;
  value: string | number | boolean;
  unit?: string;
  isKeyHighlight?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number; // Base currency: USD
  priceInr: number; // INR equivalent based on transparent rate
  currency: 'USD';
  rating: number; // 1.0 - 5.0
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  imageUrl: string;
  tags: string[];
  specs: Record<string, string | number | boolean>;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  highlightedFeature: string;
  isSampleData: boolean; // Explicit labeling required by hackathon spec
}

export interface ProductFilterOptions {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  tags?: string[];
  searchQuery?: string;
}
