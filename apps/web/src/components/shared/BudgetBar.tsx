import React from 'react';
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

interface BudgetBarProps {
  currentAmountUsd: number;
  targetBudgetUsd?: number | null;
  label?: string;
  showDetails?: boolean;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({
  currentAmountUsd,
  targetBudgetUsd: explicitBudget,
  label = 'Budget Utilization',
  showDetails = true,
}) => {
  const { userBudgetUsd, formatPrice } = useApp();
  const budget = explicitBudget ?? userBudgetUsd;

  if (!budget || budget <= 0) {
    return null;
  }

  const percentage = Math.round((currentAmountUsd / budget) * 100);
  const diff = budget - currentAmountUsd; // positive = saved, negative = over
  const isOver = diff < 0;
  const isStretch = isOver && Math.abs(diff) / budget <= 0.15;

  let progressColor = 'bg-success';
  let badgeText = `${formatPrice(diff)} remaining`;
  let badgeColor = 'text-success bg-success-subtle border-success-border';

  if (isOver) {
    if (isStretch) {
      progressColor = 'bg-warning';
      badgeText = `${formatPrice(Math.abs(diff))} stretch (+${percentage - 100}%)`;
      badgeColor = 'text-warning bg-warning-subtle border-warning-border';
    } else {
      progressColor = 'bg-danger';
      badgeText = `${formatPrice(Math.abs(diff))} over budget`;
      badgeColor = 'text-danger bg-danger-subtle border-danger-border';
    }
  }

  return (
    <div className="w-full rounded border border-border bg-surface p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <Wallet className="w-3.5 h-3.5 text-foreground-muted" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-foreground font-semibold">{formatPrice(currentAmountUsd)}</span>
          <span className="text-foreground-muted">/ {formatPrice(budget)}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-surface-subtle border border-border overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-[width] duration-300 ease-out rounded-full`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {/* Feedback Summary */}
      {showDetails && (
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <span className="text-foreground-muted">{percentage}% of target</span>
          <span className={`px-2 py-0.5 rounded border font-mono font-medium flex items-center gap-1 ${badgeColor}`}>
            {isOver ? (
              <AlertTriangle className="w-3 h-3" />
            ) : (
              <CheckCircle2 className="w-3 h-3" />
            )}
            <span>{badgeText}</span>
          </span>
        </div>
      )}
    </div>
  );
};
