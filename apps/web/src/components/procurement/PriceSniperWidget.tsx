import React, { useState } from 'react';
import {
  Crosshair,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';
import { PriceSniperRule, MultiMerchantSKU } from '@paypilot/shared';

interface PriceSniperWidgetProps {
  rules: PriceSniperRule[];
  candidateItems: MultiMerchantSKU[];
  onSimulatePriceDrop: (ruleId: string, dropPrice?: number) => Promise<void>;
  onCreateRule: (rule: Partial<PriceSniperRule>) => Promise<void>;
  isLoading?: boolean;
}

export const PriceSniperWidget: React.FC<PriceSniperWidgetProps> = ({
  rules,
  candidateItems,
  onSimulatePriceDrop,
  onCreateRule,
  isLoading = false,
}) => {
  const [isSimulatingId, setIsSimulatingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSkuId, setSelectedSkuId] = useState('');
  const [targetPrice, setTargetPrice] = useState<number>(85);

  const handleSimulate = async (ruleId: string, triggerPrice: number) => {
    try {
      setIsSimulatingId(ruleId);
      const simulatedDrop = Math.max(10, triggerPrice - 5);
      await onSimulatePriceDrop(ruleId, simulatedDrop);
    } finally {
      setIsSimulatingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = candidateItems.find((s) => s.skuId === selectedSkuId) || candidateItems[0];
    if (!item) return;

    await onCreateRule({
      skuId: item.skuId,
      productTitle: item.title,
      merchantDomain: item.merchantDomain,
      initialPrice: item.price,
      currentPrice: item.price,
      targetPrice: Number(targetPrice),
      status: 'ARMED',
      userEmail: 'agent.buyer@paypilot.ai',
      spendPolicyHash: 'passport_auto_armed',
    });

    setIsCreating(false);
  };

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-4 shadow-xs">
      <div className="flex items-start justify-between gap-2.5 pb-3 border-b border-border/70">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
            <Crosshair className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-semibold text-foreground whitespace-nowrap">
                Autonomous Price Sniper
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 font-medium border border-rose-500/20 whitespace-nowrap">
                Background watcher
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted mt-0.5 leading-snug">
              Monitors catalog prices and triggers automated PayPal checkout on price drops.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-surface-subtle flex items-center gap-1.5 transition-colors duration-150 text-foreground-muted hover:text-foreground shrink-0 whitespace-nowrap"
          title="Arm background monitoring on a candidate SKU"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>{isCreating ? 'Cancel' : 'Arm sniper'}</span>
        </button>
      </div>

      {/* Arm Sniper Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="mt-3 p-3 bg-surface-subtle/70 rounded-xl border border-border space-y-3 text-xs"
        >
          <div className="font-semibold text-foreground">
            Arm sniper on candidate product
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-foreground-muted mb-1">
                Target product
              </label>
              <select
                value={selectedSkuId}
                onChange={(e) => {
                  setSelectedSkuId(e.target.value);
                  const found = candidateItems.find((s) => s.skuId === e.target.value);
                  if (found) setTargetPrice(Math.round(found.price * 0.85));
                }}
                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none"
              >
                <option value="">Select candidate product...</option>
                {candidateItems.map((sku) => (
                  <option key={sku.skuId} value={sku.skuId}>
                    {sku.title.slice(0, 42)} (${sku.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-foreground-muted mb-1">
                Trigger price ($)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-foreground font-mono focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 rounded-lg border border-border text-foreground hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors duration-150"
            >
              Arm rule
            </button>
          </div>
        </form>
      )}

      {/* Sniper Rules List */}
      <div className="mt-3 space-y-2.5">
        {rules.length === 0 ? (
          <div className="text-center py-6 text-foreground-muted text-xs">
            No active sniper rules armed. Arm a rule above or run a judge preset.
          </div>
        ) : (
          rules.map((rule) => {
            const isSimulating = isSimulatingId === rule.ruleId;
            const isExecuted = rule.status === 'EXECUTED';
            const savings = Math.max(0, (rule.initialPrice || rule.currentPrice) - rule.currentPrice);

            return (
              <div
                key={rule.ruleId}
                className="p-3 rounded-xl bg-surface-subtle/50 border border-border/70 hover:border-border transition-colors duration-150 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        isExecuted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                      }`}
                    >
                      {isExecuted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate" title={rule.productTitle}>
                        {rule.productTitle}
                      </h4>
                      <span className="text-[10.5px] text-foreground-muted block truncate">
                        via {rule.merchantDomain}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      isExecuted
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {isExecuted ? 'Executed' : 'Armed'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/50 text-xs">
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="text-foreground-muted">
                      Target: <strong className="text-rose-600 dark:text-rose-400 font-mono">${rule.targetPrice.toFixed(2)}</strong>
                    </span>
                    {savings > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3" />
                        <span>Saved ${savings.toFixed(2)}</span>
                      </span>
                    )}
                  </div>

                  {/* Execution Status or Trigger Button */}
                  <div className="shrink-0">
                    {isExecuted ? (
                      <div className="text-right">
                        <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                          Auto-captured
                        </span>
                        <span className="text-[9.5px] font-mono text-foreground-muted block max-w-[130px] truncate" title={rule.executedOrderId}>
                          PayPal: {rule.executedOrderId || 'ORDER_CAPTURED'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleSimulate(
                            rule.ruleId,
                            rule.targetPrice
                          )
                        }
                        disabled={isSimulating || isLoading}
                        className="px-2.5 py-1 rounded-md bg-accent text-white hover:bg-accent/90 text-[11px] font-medium flex items-center gap-1 shadow-xs transition-colors duration-150 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                        title="1-click trigger: drops price below threshold and captures order via PayPal Agent Toolkit"
                      >
                        {isSimulating ? (
                          <>
                            <RotateCcw className="w-3 h-3 animate-spin" />
                            <span>Sniping...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Simulate price drop</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
