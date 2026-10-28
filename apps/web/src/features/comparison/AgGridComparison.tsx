import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeQuartz,
} from 'ag-grid-community';
import { Product } from '@paypilot/shared';
import { useApp } from '../../context/AppContext.js';
import { Plus, Check, Star } from 'lucide-react';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface AgGridComparisonProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const AgGridComparison: React.FC<AgGridComparisonProps> = ({
  products,
  title = 'AG Grid Advanced Spec Matrix',
  subtitle = 'Interactive sorting, filtering, and cross-comparison powered by AG Grid (Hackathon Sponsor)',
}) => {
  const { formatPrice, addToCart, cart, setSelectedProductForDetail } = useApp();

  const rowData = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category.replace('-', ' '),
      priceUsd: p.price,
      priceFormatted: formatPrice(p.price),
      rating: p.rating,
      reviewCount: p.reviewCount,
      highlight: p.highlightedFeature,
      inStock: p.inStock ? `In Stock (${p.stockCount})` : 'Out of Stock',
      battery: p.specs.batteryHours ? `${p.specs.batteryHours} Hours` : 'N/A',
      anc: p.specs.activeNoiseCancellation !== undefined ? (p.specs.activeNoiseCancellation ? 'Yes (ANC)' : 'Passive') : 'N/A',
      rawProduct: p,
    }));
  }, [products, formatPrice]);

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: 'Product',
        field: 'name',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        flex: 2,
        minWidth: 220,
        cellRenderer: (params: any) => {
          return (
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-accent font-medium truncate"
              onClick={() => setSelectedProductForDetail(params.data.rawProduct)}
            >
              <span className="truncate">{params.value}</span>
            </div>
          );
        },
      },
      {
        headerName: 'Brand',
        field: 'brand',
        filter: 'agTextColumnFilter',
        width: 120,
        cellClass: 'font-mono uppercase text-[11px]',
      },
      {
        headerName: 'Category',
        field: 'category',
        filter: 'agTextColumnFilter',
        width: 130,
        cellClass: 'capitalize text-xs',
      },
      {
        headerName: 'Verified Price',
        field: 'priceUsd',
        filter: 'agNumberColumnFilter',
        width: 130,
        cellRenderer: (params: any) => {
          return (
            <span className="font-mono font-bold text-foreground">
              {params.data.priceFormatted}
            </span>
          );
        },
      },
      {
        headerName: 'Rating',
        field: 'rating',
        filter: 'agNumberColumnFilter',
        width: 110,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1 font-mono text-xs">
              <Star className="w-3.5 h-3.5 fill-warning text-warning" />
              <span>{params.value}</span>
            </div>
          );
        },
      },
      {
        headerName: 'Battery / Key Spec',
        field: 'battery',
        width: 140,
        cellClass: 'font-mono text-xs',
      },
      {
        headerName: 'Status',
        field: 'inStock',
        width: 130,
        cellRenderer: (params: any) => {
          const isAvailable = params.data.rawProduct.inStock;
          return (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                isAvailable
                  ? 'bg-success-subtle text-success border border-success-border'
                  : 'bg-danger-subtle text-danger border border-danger-border'
              }`}
            >
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: 'Action',
        width: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const p = params.data.rawProduct;
          const inCart = cart.some((it) => it.productId === p.id);
          return (
            <div className="flex items-center h-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="px-2.5 py-1 rounded bg-foreground text-surface hover:bg-accent text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
              >
                {inCart ? (
                  <>
                    <Check className="w-3 h-3 text-success" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Select</span>
                  </>
                )}
              </button>
            </div>
          );
        },
      },
    ];
  }, [cart, addToCart, setSelectedProductForDetail]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
    };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-tactile space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <span className="px-2 py-0.5 rounded bg-surface-subtle text-foreground-muted border border-border text-[10px] font-mono font-semibold">
              ⚡ AG GRID SPONSOR TRACK
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-mono text-foreground-muted">
          {products.length} {products.length === 1 ? 'row' : 'rows'} loaded
        </span>
      </div>

      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
        <AgGridReact
          theme={themeQuartz}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
        />
      </div>
    </div>
  );
};
