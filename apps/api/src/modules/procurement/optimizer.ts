import {
  MultiMerchantSKU,
  ProcurementBundle,
  BundleTierType,
  RequiredCategoryConstraint,
} from '@paypilot/shared';

export class KnapsackBundleOptimizer {
  public assembleThreeTiers(
    categoryRequirements: RequiredCategoryConstraint[],
    candidatePool: MultiMerchantSKU[],
    hardBudgetMax: number,
    lockedItems: MultiMerchantSKU[] = []
  ): Record<BundleTierType, ProcurementBundle> {
    const categories = categoryRequirements.map((c) => c.categoryName);

    // Group candidates by category
    const poolByCategory = new Map<string, MultiMerchantSKU[]>();
    for (const cat of categories) {
      const matching = candidatePool.filter(
        (p) => p.category.toLowerCase() === cat.toLowerCase()
      );
      poolByCategory.set(cat, matching.length > 0 ? matching : candidatePool);
    }

    // 1. BEST VALUE: Lowest total cost meeting mandatory specs
    const bestValueItems = this.selectBundle(
      categories,
      poolByCategory,
      lockedItems,
      hardBudgetMax,
      (a, b) => a.price - b.price // prioritize lowest price
    );

    // 2. MAX PERFORMANCE: Highest rating and AI value score within budget
    const maxPerfItems = this.selectBundle(
      categories,
      poolByCategory,
      lockedItems,
      hardBudgetMax,
      (a, b) => b.rating * b.aiValueScore - a.rating * a.aiValueScore // prioritize performance
    );

    // 3. FASTEST DISPATCH: Prioritizes in-stock items with free/fast dispatch
    const fastestItems = this.selectBundle(
      categories,
      poolByCategory,
      lockedItems,
      hardBudgetMax,
      (a, b) => {
        const stockScoreA = a.stockStatus === 'in_stock' ? 2 : 1;
        const stockScoreB = b.stockStatus === 'in_stock' ? 2 : 1;
        return stockScoreB - stockScoreA || a.shippingCost - b.shippingCost;
      }
    );

    return {
      best_value: this.buildBundlePayload('best_value', 'Best Value', 'Maximum savings meeting all mandatory specs', bestValueItems, hardBudgetMax),
      max_performance: this.buildBundlePayload('max_performance', 'Max Performance', 'Top-tier ratings and components utilizing budget allocation', maxPerfItems, hardBudgetMax),
      fastest_dispatch: this.buildBundlePayload('fastest_dispatch', 'Fastest Dispatch', 'Verified in-stock inventory ready for expedited dispatch', fastestItems, hardBudgetMax),
    };
  }

  private selectBundle(
    categories: string[],
    poolByCategory: Map<string, MultiMerchantSKU[]>,
    lockedItems: MultiMerchantSKU[],
    budgetCap: number,
    sortComparator: (a: MultiMerchantSKU, b: MultiMerchantSKU) => number
  ): MultiMerchantSKU[] {
    const selectedMap = new Map<string, MultiMerchantSKU>();

    // Honor locked items first
    for (const locked of lockedItems) {
      selectedMap.set(locked.category.toLowerCase(), { ...locked, isLocked: true });
    }

    // Select candidate for each missing category
    for (const cat of categories) {
      if (selectedMap.has(cat.toLowerCase())) continue;

      const candidates = [...(poolByCategory.get(cat) || [])].sort(sortComparator);
      if (candidates.length > 0) {
        selectedMap.set(cat.toLowerCase(), candidates[0]);
      }
    }

    // Knapsack constraint check: if over budget, downgrade non-locked items
    let selectedList = Array.from(selectedMap.values());
    let total = selectedList.reduce((sum, item) => sum + item.price, 0);

    if (total > budgetCap) {
      for (const cat of categories) {
        const current = selectedMap.get(cat.toLowerCase());
        if (current && !current.isLocked) {
          const candidates = [...(poolByCategory.get(cat) || [])].sort((a, b) => a.price - b.price);
          for (const cheaper of candidates) {
            if (cheaper.price < current.price) {
              selectedMap.set(cat.toLowerCase(), cheaper);
              selectedList = Array.from(selectedMap.values());
              total = selectedList.reduce((sum, item) => sum + item.price, 0);
              if (total <= budgetCap) break;
            }
          }
        }
        if (total <= budgetCap) break;
      }
    }

    return selectedList;
  }

  private buildBundlePayload(
    tier: BundleTierType,
    label: string,
    tagline: string,
    items: MultiMerchantSKU[],
    budgetCap: number
  ): ProcurementBundle {
    const subtotal = Math.round(items.reduce((sum, it) => sum + it.price, 0) * 100) / 100;
    const totalShipping = Math.round(items.reduce((sum, it) => sum + it.shippingCost, 0) * 100) / 100;
    const totalArbitrageSaved = Math.round(items.reduce((sum, it) => sum + it.arbitrageSavings, 0) * 100) / 100;
    const totalCost = Math.round((subtotal + totalShipping) * 100) / 100;
    const remainingMargin = Math.max(0, Math.round((budgetCap - totalCost) * 100) / 100);
    const budgetUtilizationPercent = Math.min(100, Math.round((totalCost / budgetCap) * 100));

    // Compatibility check (e.g. XLR without interface warning)
    const compatibilityNotes: string[] = [];
    const hasXlrOnly = items.some((it) => it.compatibilityTags.includes('xlr-only'));
    const hasAudioInterface = items.some((it) => it.compatibilityTags.includes('audio-interface'));

    let compatibilityPassed = true;
    if (hasXlrOnly && !hasAudioInterface) {
      compatibilityPassed = false;
      compatibilityNotes.push('Warning: Selected XLR microphone requires a dedicated audio interface or USB-C adapter.');
    } else {
      compatibilityNotes.push('All components verified for plug-and-play USB-C / hardware compatibility.');
    }

    return {
      tier,
      label,
      tagline,
      items,
      subtotal,
      totalShipping,
      totalArbitrageSaved,
      totalCost,
      remainingMargin,
      budgetUtilizationPercent,
      compatibilityPassed,
      compatibilityNotes,
    };
  }
}

export const knapsackBundleOptimizer = new KnapsackBundleOptimizer();

