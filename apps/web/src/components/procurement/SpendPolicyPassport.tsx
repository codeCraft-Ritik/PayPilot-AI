import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { SpendPolicyConfig, GuardrailEvaluation } from '@paypilot/shared';

interface SpendPolicyPassportProps {
  policy: SpendPolicyConfig;
  evaluation: GuardrailEvaluation | null;
  onUpdatePolicy: (policy: Partial<SpendPolicyConfig>) => void;
  cartTotalUsd: number;
}

export const SpendPolicyPassport: React.FC<SpendPolicyPassportProps> = ({
  policy,
  evaluation,
  onUpdatePolicy,
  cartTotalUsd,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [softCap, setSoftCap] = useState(policy.maxAutoApproveLimit);
  const [hardCap, setHardCap] = useState(policy.hardTransactionCeiling);
  const [velocityCap, setVelocityCap] = useState(policy.dailySpendVelocityCap);
  const [requireVerified, setRequireVerified] = useState(
    policy.requireVerifiedMerchants
  );

  const handleSavePolicy = () => {
    onUpdatePolicy({
      maxAutoApproveLimit: Number(softCap),
      hardTransactionCeiling: Number(hardCap),
      dailySpendVelocityCap: Number(velocityCap),
      requireVerifiedMerchants: requireVerified,
    });
    setIsEditing(false);
  };

  const copyHash = () => {
    if (evaluation?.policyPassportHash) {
      navigator.clipboard.writeText(evaluation.policyPassportHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const zone = evaluation?.zone || (cartTotalUsd <= policy.maxAutoApproveLimit ? 'GREEN' : cartTotalUsd <= policy.hardTransactionCeiling ? 'YELLOW' : 'RED');

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-2.5 pb-3 border-b border-border/70">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-semibold text-foreground whitespace-nowrap">
                Spend Policy Passport
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium border border-indigo-500/20 whitespace-nowrap">
                Cryptographic guardrails
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted mt-0.5 leading-snug">
              Pre-authorized spending limits enforced before calling PayPal API execution.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-surface-subtle flex items-center gap-1.5 transition-colors duration-150 text-foreground-muted hover:text-foreground shrink-0 whitespace-nowrap"
          title="Customize auto-approve ceilings and rules"
        >
          <Sliders className="w-3.5 h-3.5 shrink-0" />
          <span>{isEditing ? 'Cancel' : 'Adjust limits'}</span>
        </button>
      </div>

      {/* Zone Status Banner */}
      <div className="mt-3">
        {zone === 'GREEN' && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Green zone: Autonomous checkout authorized
                </span>
              </div>
              <p className="text-xs text-foreground mt-0.5">
                Cart total (${cartTotalUsd.toFixed(2)}) is within your auto-approval threshold (${policy.maxAutoApproveLimit.toFixed(2)}). PayPal order creation and payment capture proceed autonomously.
              </p>
            </div>
          </div>
        )}

        {zone === 'YELLOW' && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Yellow zone: Review required
                </span>
              </div>
              <p className="text-xs text-foreground mt-0.5">
                Cart total (${cartTotalUsd.toFixed(2)}) exceeds the autonomous threshold (${policy.maxAutoApproveLimit.toFixed(2)}) but remains below the hard ceiling (${policy.hardTransactionCeiling.toFixed(2)}). Agent will pause for human sign-off.
              </p>
            </div>
          </div>
        )}

        {zone === 'RED' && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                  Red zone: Blocked by ceiling
                </span>
              </div>
              <p className="text-xs text-foreground mt-0.5">
                {evaluation?.zoneReason ||
                  `Cart total ($${cartTotalUsd.toFixed(2)}) exceeds the hard transaction ceiling ($${policy.hardTransactionCeiling.toFixed(2)}). Execution is blocked.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Editable Controls */}
      {isEditing ? (
        <div className="mt-3 p-3 bg-surface-subtle/60 rounded-xl border border-border/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-foreground-muted mb-1">
                Green zone ceiling ($)
              </label>
              <input
                type="number"
                value={softCap}
                onChange={(e) => setSoftCap(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-foreground-muted mb-1">
                Hard ceiling ($)
              </label>
              <input
                type="number"
                value={hardCap}
                onChange={(e) => setHardCap(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-foreground-muted mb-1">
                Daily velocity cap ($)
              </label>
              <input
                type="number"
                value={velocityCap}
                onChange={(e) => setVelocityCap(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={requireVerified}
                  onChange={(e) => setRequireVerified(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Require verified merchants</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs rounded-lg border border-border hover:bg-surface text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePolicy}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors duration-150"
            >
              Apply limits
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl bg-surface-subtle/50 hover:bg-surface-subtle border border-border/70 hover:border-accent/40 text-left transition-colors duration-150 flex flex-col justify-between group"
            title="Click to adjust Green ceiling"
          >
            <span className="text-[11px] text-foreground-muted group-hover:text-foreground font-medium block truncate">
              Green ceiling
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              ${policy.maxAutoApproveLimit.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl bg-surface-subtle/50 hover:bg-surface-subtle border border-border/70 hover:border-accent/40 text-left transition-colors duration-150 flex flex-col justify-between group"
            title="Click to adjust Hard ceiling"
          >
            <span className="text-[11px] text-foreground-muted group-hover:text-foreground font-medium block truncate">
              Hard ceiling
            </span>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-1 block">
              ${policy.hardTransactionCeiling.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl bg-surface-subtle/50 hover:bg-surface-subtle border border-border/70 hover:border-accent/40 text-left transition-colors duration-150 flex flex-col justify-between group"
            title="Click to adjust Daily velocity"
          >
            <span className="text-[11px] text-foreground-muted group-hover:text-foreground font-medium block truncate">
              Daily velocity
            </span>
            <span className="text-xs font-mono font-bold text-foreground mt-1 block">
              ${policy.dailySpendVelocityCap.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl bg-surface-subtle/50 hover:bg-surface-subtle border border-border/70 hover:border-accent/40 text-left transition-colors duration-150 flex flex-col justify-between group"
            title="Click to toggle Merchant filter"
          >
            <span className="text-[11px] text-foreground-muted block truncate">
              Merchant filter
            </span>
            <span className="text-xs font-medium text-foreground mt-1 block truncate">
              {policy.requireVerifiedMerchants ? 'Verified only' : 'All merchants'}
            </span>
          </button>
        </div>
      )}

      {/* Cryptographic Hash Passport Banner */}
      <div className="mt-3 pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-foreground-muted truncate">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="shrink-0 text-foreground font-medium">Passport SHA-256:</span>
          <span className="truncate text-foreground-muted font-mono text-[11px]" title={evaluation?.policyPassportHash || 'Hash ready'}>
            {evaluation?.policyPassportHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
          </span>
        </div>

        <button
          onClick={copyHash}
          className="shrink-0 flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-surface-subtle hover:bg-surface border border-border text-foreground-muted hover:text-foreground transition-colors duration-150 self-start sm:self-auto whitespace-nowrap"
          title="Copy cryptographic signature embedded into PayPal Order custom_id"
        >
          {copiedHash ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy custom_id hash</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
