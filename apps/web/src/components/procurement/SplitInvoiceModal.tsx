import React, { useState } from 'react';
import {
  Users,
  X,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { MultiMerchantSKU, SplitInvoiceResponse } from '@paypilot/shared';

interface SplitInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MultiMerchantSKU[];
  totalAmountUsd: number;
  onExecuteSplit: (data: {
    teammates: { email: string; name: string; shareUsd: number }[];
    note: string;
  }) => Promise<SplitInvoiceResponse>;
}

export const SplitInvoiceModal: React.FC<SplitInvoiceModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmountUsd,
  onExecuteSplit,
}) => {
  const [teammates, setTeammates] = useState([
    { email: 'alex.creator@example.com', name: 'Alex Rivera', shareUsd: 0 },
    { email: 'sam.audio@example.com', name: 'Sam Chen', shareUsd: 0 },
  ]);
  const [note, setNote] = useState('BuyWard Squad Procurement: Shared Studio Equipment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SplitInvoiceResponse | null>(null);

  // Auto-distribute evenly whenever teammates list changes or total changes
  React.useEffect(() => {
    if (teammates.length > 0) {
      const share = Number((totalAmountUsd / teammates.length).toFixed(2));
      setTeammates((prev) =>
        prev.map((t, idx) => ({
          ...t,
          shareUsd:
            idx === prev.length - 1
              ? Number((totalAmountUsd - share * (prev.length - 1)).toFixed(2))
              : share,
        }))
      );
    }
  }, [teammates.length, totalAmountUsd]);

  if (!isOpen) return null;

  const addTeammate = () => {
    if (teammates.length >= 4) return;
    setTeammates((prev) => [
      ...prev,
      {
        email: `teammate${prev.length + 1}@example.com`,
        name: `Teammate ${prev.length + 1}`,
        shareUsd: 0,
      },
    ]);
  };

  const removeTeammate = (index: number) => {
    if (teammates.length <= 1) return;
    setTeammates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    setTeammates((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await onExecuteSplit({ teammates, note });
      setResult(res);
    } catch (err) {
      console.error('Split invoice error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Squad Buy: Multi-party split invoicing
              </h3>
              <p className="text-xs text-foreground-muted">
                Generates individual PayPal invoices via the REST v2 Invoicing API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-subtle text-foreground-muted hover:text-foreground transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Invoices generated and dispatched
                  </h4>
                  <p className="text-foreground mt-0.5">
                    Batch reference: <code className="font-mono">BATCH-{result.splitCount}-{result.createdAt.slice(0, 10)}</code>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-foreground-muted text-xs">
                  Generated invoices ({result.invoices.length})
                </div>
                {result.invoices.map((inv) => (
                  <div
                    key={inv.invoiceId}
                    className="p-3 rounded-lg border border-border/70 bg-surface-subtle/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium text-foreground">
                        {inv.payerEmail}
                      </div>
                      <div className="text-[11px] text-foreground-muted mt-0.5">
                        Invoice #{inv.invoiceNumber} • <span className="font-mono font-semibold">${inv.amountUsd.toFixed(2)}</span>
                      </div>
                    </div>

                    <a
                      href={inv.viewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-md bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium flex items-center gap-1 border border-accent/20 transition-colors duration-150"
                    >
                      <span>Pay sandbox</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-foreground text-background font-medium text-xs hover:bg-foreground/90 transition-colors duration-150"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cart Summary */}
              <div className="p-3 rounded-xl bg-surface-subtle border border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-foreground-muted block text-xs">
                    Cart total ({items.length} items)
                  </span>
                  <span className="text-base font-mono font-bold text-foreground">
                    ${totalAmountUsd.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-foreground-muted block text-xs">
                    Per-person share
                  </span>
                  <span className="text-sm font-mono font-bold text-accent">
                    ${(totalAmountUsd / teammates.length).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Teammates List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-foreground text-xs">
                    Recipients ({teammates.length} members)
                  </label>
                  {teammates.length < 4 && (
                    <button
                      type="button"
                      onClick={addTeammate}
                      className="text-accent hover:underline flex items-center gap-1 text-xs font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add recipient
                    </button>
                  )}
                </div>

                {teammates.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border/70 bg-surface-subtle/40 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="email"
                        placeholder="PayPal Email"
                        value={member.email}
                        onChange={(e) => handleUpdate(idx, 'email', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        value={member.shareUsd}
                        onChange={(e) =>
                          handleUpdate(idx, 'shareUsd', Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent"
                        required
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      {teammates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeammate(idx)}
                          className="p-1 rounded text-foreground-muted hover:text-rose-500 transition-colors duration-150"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div>
                <label className="block text-foreground-muted mb-1 text-xs">
                  Invoice memo
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/70">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-surface-subtle font-medium text-xs transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching invoices...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send split invoices</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
