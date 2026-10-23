import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service.js';
import { ProductCategory } from '@paypilot/shared';

export class ProductController {
  public getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const { category, minPrice, maxPrice, minRating, inStockOnly, search } = req.query;

      const filter = {
        category: category as ProductCategory | 'all',
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        inStockOnly: inStockOnly === 'true',
        searchQuery: search as string,
      };

      const products = productService.getProducts(filter);
      res.json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  public getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const product = productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          error: `Product with ID '${id}' not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  public getCategories(_req: Request, res: Response, next: NextFunction): void {
    try {
      const categories = productService.getCategories();
      res.json({
        success: true,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
