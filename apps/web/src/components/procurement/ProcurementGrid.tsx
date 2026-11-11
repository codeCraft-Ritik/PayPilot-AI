import React, { useMemo, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  GridReadyEvent,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  Lock,
  Unlock,
  TrendingDown,
  Download,
  CheckCircle,
} from 'lucide-react';
import {
  MultiMerchantSKU,
  ProcurementBundle,
  BundleTierType,
} from '@paypilot/shared';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ProcurementGridProps {
  bundles: Record<BundleTierType, ProcurementBundle> | null;
  activeTier: BundleTierType;
  onSelectTier: (tier: BundleTierType) => void;
  hardBudgetMax: number;
  allCandidatePool: MultiMerchantSKU[];
  onLockToggle: (skuId: string, locked: boolean) => void;
  onQuantityChange?: (skuId: string, quantity: number) => void;
  onSwapItem: (oldSkuId: string, newSku: MultiMerchantSKU) => void;
}

interface GridRowItem extends MultiMerchantSKU {
  locked?: boolean;
  quantity?: number;
}

export const ProcurementGrid: React.FC<ProcurementGridProps> = ({
  bundles,
  activeTier,
  onSelectTier,
  hardBudgetMax,
  allCandidatePool,
  onLockToggle,
  onSwapItem,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApiReady, setGridApiReady] = useState(false);

  const currentBundle = bundles ? bundles[activeTier] : null;

  const rowData: GridRowItem[] = useMemo(() => {
    if (!currentBundle || !currentBundle.items) return [];
    return currentBundle.items.map((item) => ({
      ...item,
      quantity: 1,
    }));
  }, [currentBundle]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApiReady(true);
    params.api.sizeColumnsToFit();
  }, []);

  const handleExportCsv = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `buyward-procurement-${activeTier}-audit.csv`,
      });
    }
  }, [activeTier]);

  // Compute pinned bottom row summary
  const pinnedBottomRowData = useMemo(() => {
    if (!currentBundle) return [];
    const totalItems = rowData.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const totalArbitrage = currentBundle.totalArbitrageSaved || 0;
    const shipping = 0; // Free / included in tier
    const totalCost = currentBundle.totalCost || 0;
    const margin = Math.max(0, hardBudgetMax - totalCost);

    return [
      {
        skuId: 'SUMMARY',
        title: `Total (${totalItems} items)`,
        category: 'SUMMARY',
        merchantName: 'Multi-Merchant Cart',
        merchantDomain: 'Consolidated',
        price: totalCost,
        retailAvgPrice: totalCost + totalArbitrage,
        shippingCost: shipping,
        stockStatus: 'IN_STOCK' as const,
        rating: 5,
        specs: {},
        arbitrageSavings: totalArbitrage,
        isLowestPrice: true,
        aiScore: 100,
        locked: false,
        quantity: totalItems,
        isSummaryRow: true,
        remainingMargin: margin,
      },
    ];
  }, [currentBundle, rowData, hardBudgetMax]);

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: 'Category',
        field: 'category',
        width: 140,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) {
            return <strong className="font-semibold text-xs text-foreground">Summary</strong>;
          }
          return (
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-surface-subtle border border-border/80 text-foreground-muted capitalize">
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: 'Product & Must-Have Specs',
        field: 'title',
        flex: 2,
        minWidth: 260,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) {
            return (
              <span className="font-semibold text-xs text-foreground">
                Cart Total & Margin Allocation
              </span>
            );
          }
          const item: GridRowItem = params.data;
          const specsList = Object.entries(item.specs || {}).slice(0, 3);

          return (
            <div className="flex items-center gap-2.5 py-1">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-10 h-10 rounded-lg object-cover border border-border/70 shrink-0 bg-surface-subtle"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border/70 flex items-center justify-center text-foreground-muted text-xs shrink-0">
                  Item
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-medium text-xs text-foreground truncate" title={item.title}>
                  {item.title}
                </div>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {specsList.map(([key, val]) => (
                    <span
                      key={key}
                      className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-surface-subtle border border-border/60 text-foreground-muted"
                    >
                      {String(val)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        headerName: 'Merchant & Arbitrage',
        field: 'merchantDomain',
        width: 190,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) {
            const totalSaved = params.data?.arbitrageSavings || 0;
            return (
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                +${totalSaved.toFixed(2)} total arbitrage
              </span>
            );
          }
          const item: GridRowItem = params.data;
          const savings = (item.retailAvgPrice || item.price) - item.price;

          return (
            <div className="flex flex-col justify-center py-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">
                  {item.merchantDomain}
                </span>
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
              </div>
              {savings > 0 && (
                <div className="mt-0.5">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <TrendingDown className="w-2.5 h-2.5" />
                    +${savings.toFixed(2)} saved
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        headerName: 'AI Value Score',
        field: 'aiScore',
        width: 140,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) {
            return (
              <span className="text-xs font-medium text-foreground-muted">
                Optimized
              </span>
            );
          }
          const score = params.value || 85;
          const colorClass =
            score >= 90
              ? 'bg-emerald-500'
              : score >= 75
              ? 'bg-indigo-500'
              : 'bg-amber-500';

          return (
            <div className="flex items-center gap-2 h-full">
              <div className="w-14 h-2 rounded-full bg-surface-subtle overflow-hidden border border-border/80">
                <div
                  className={`h-full ${colorClass}`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-foreground">
                {score}
              </span>
            </div>
          );
        },
      },
      {
        headerName: 'Price',
        field: 'price',
        width: 100,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) {
            return (
              <span className="text-xs font-mono font-bold text-foreground">
                ${Number(params.value).toFixed(2)}
              </span>
            );
          }
          return (
            <div className="flex flex-col justify-center h-full">
              <span className="text-xs font-mono font-bold text-foreground">
                ${Number(params.value).toFixed(2)}
              </span>
              {params.data.retailAvgPrice > params.value && (
                <span className="text-[10px] font-mono line-through text-foreground-muted">
                  ${params.data.retailAvgPrice.toFixed(2)}
                </span>
              )}
            </div>
          );
        },
      },
      {
        headerName: 'Lock & Recalc',
        field: 'locked',
        width: 110,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) {
            const margin = params.data.remainingMargin || 0;
            return (
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ${margin.toFixed(2)} Left
              </span>
            );
          }
          const item: GridRowItem = params.data;
          const isLocked = !!item.locked;

          return (
            <div className="flex items-center h-full">
              <button
                onClick={() => onLockToggle(item.skuId, !isLocked)}
                className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-medium transition-colors duration-150 ${
                  isLocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'bg-surface-subtle border-border/80 text-foreground-muted hover:text-foreground'
                }`}
                title={
                  isLocked
                    ? 'Locked in knapsack. Click to unlock.'
                    : 'Click to lock row. Other unlocked rows will auto-recalculate under budget.'
                }
              >
                {isLocked ? (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>Lock</span>
                  </>
                )}
              </button>
            </div>
          );
        },
      },
      {
        headerName: 'Candidate Swapper',
        field: 'skuId',
        width: 180,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data?.isSummaryRow) return null;
          const currentItem: GridRowItem = params.data;
          const alternatives = allCandidatePool.filter(
            (c) =>
              c.category === currentItem.category && c.skuId !== currentItem.skuId
          );

          if (alternatives.length === 0) {
            return (
              <span className="text-xs text-foreground-muted">
                Best match selected
              </span>
            );
          }

          return (
            <div className="flex items-center h-full">
              <select
                className="w-full text-[10px] font-mono px-2 py-1 rounded bg-surface border border-border text-foreground focus:outline-none"
                defaultValue=""
                onChange={(e) => {
                  const targetSku = alternatives.find(
                    (a) => a.skuId === e.target.value
                  );
                  if (targetSku) {
                    onSwapItem(currentItem.skuId, targetSku);
                  }
                }}
              >
                <option value="" disabled>
                  Swap Alternative ({alternatives.length})...
                </option>
                {alternatives.map((alt) => (
                  <option key={alt.skuId} value={alt.skuId}>
                    {alt.title.slice(0, 24)}... (${alt.price})
                  </option>
                ))}
              </select>
            </div>
          );
        },
      },
    ];
  }, [allCandidatePool, onLockToggle, onSwapItem]);

  return (
    <div className="w-full bg-surface border border-border/80 rounded-2xl p-4 shadow-xs space-y-3">
      {/* Top Bar: Tier Selector + Budget Indicator + Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-1.5 p-1 bg-surface-subtle rounded-xl border border-border/70">
          <button
            onClick={() => onSelectTier('best_value')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTier === 'best_value'
                ? 'bg-surface text-accent shadow-xs border border-border/80 font-semibold'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Best value
          </button>
          <button
            onClick={() => onSelectTier('max_performance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTier === 'max_performance'
                ? 'bg-surface text-accent shadow-xs border border-border/80 font-semibold'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Max performance
          </button>
          <button
            onClick={() => onSelectTier('fastest_dispatch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTier === 'fastest_dispatch'
                ? 'bg-surface text-accent shadow-xs border border-border/80 font-semibold'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Fastest dispatch
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentBundle && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-foreground-muted">Cart Total:</span>
              <strong className="text-foreground font-mono tabular-nums">${currentBundle.totalCost.toFixed(2)}</strong>
              <span className="text-foreground-muted">/</span>
              <span className="text-foreground-muted font-mono tabular-nums">${hardBudgetMax.toFixed(2)} cap</span>
            </div>
          )}

          <button
            onClick={handleExportCsv}
            disabled={!gridApiReady || rowData.length === 0}
            className="px-3 py-1.5 rounded-xl border border-border hover:bg-surface-subtle text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 shadow-xs disabled:opacity-50"
            title="Export procurement matrix to CSV via AG Grid native export"
          >
            <Download className="w-3.5 h-3.5 text-foreground-muted" />
            <span>Export audit CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Table Viewport */}
      <div className="ag-theme-alpine w-full h-[420px] rounded-xl overflow-hidden border border-border/80">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pinnedBottomRowData={pinnedBottomRowData}
          rowHeight={64}
          headerHeight={38}
          animateRows={true}
          onGridReady={onGridReady}
          defaultColDef={{
            sortable: true,
            resizable: true,
          }}
          noRowsOverlayComponent={() => (
            <div className="p-8 text-center text-xs text-foreground-muted">
              No procurement bundle loaded. Run a preset to populate the matrix.
            </div>
          )}
        />
      </div>

      {/* Grid Legend & Compatibility Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-foreground-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>Lock pins item during knapsack solver recalculation</span>
          </span>
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-500" />
            <span>Arbitrage verified across product graph</span>
          </span>
        </div>
        <div className="text-foreground font-medium">
          Interactive procurement matrix
        </div>
      </div>
    </div>
  );
};
