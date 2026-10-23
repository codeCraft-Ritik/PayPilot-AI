import { Product, ProductCategory, ProductFilterOptions, CATEGORIES } from '@paypilot/shared';
import { IProductRepository, productRepository } from './product.repository.js';

export class ProductService {
  constructor(private repo: IProductRepository = productRepository) {}

  public getProducts(filter?: ProductFilterOptions): Product[] {
    return this.repo.getAll(filter);
  }

  public getProductById(id: string): Product | undefined {
    return this.repo.getById(id);
  }

  public getProductsByIds(ids: string[]): Product[] {
    return this.repo.getByIds(ids);
  }

  public getCategories() {
    return CATEGORIES;
  }
}

export const productService = new ProductService();
